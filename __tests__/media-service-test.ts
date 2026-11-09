import * as ImagePicker from "expo-image-picker";

import { DEVICE_MESSAGES } from "@/services/constants/device-messages";
import { deletePhoto, pickPhoto, takePhoto } from "@/services/media";

const mockCopy = jest.fn<Promise<void>, []>();
const mockDelete = jest.fn<void, []>();
const mockCreate = jest.fn<void, []>();

jest.mock("expo-crypto", () => ({
  randomUUID: jest.fn(() => "photo-id"),
}));

jest.mock("expo-file-system", () => {
  class MockDirectory {
    uri: string;

    constructor(...uris: unknown[]) {
      this.uri = uris
        .map((uri) =>
          typeof uri === "string" ? uri : (uri as { uri: string }).uri,
        )
        .join("/");
    }

    create = mockCreate;
  }

  class MockFile {
    uri: string;
    extension: string;

    constructor(...uris: unknown[]) {
      this.uri = uris
        .map((uri) =>
          typeof uri === "string" ? uri : (uri as { uri: string }).uri,
        )
        .join("/");
      this.extension = /\.[^./]+$/.exec(this.uri)?.[0] ?? "";
    }

    copy = mockCopy;
    delete = mockDelete;
  }

  return {
    Directory: MockDirectory,
    File: MockFile,
    Paths: { document: "file:///documents" },
  };
});

jest.mock("expo-image-picker", () => ({
  requestCameraPermissionsAsync: jest.fn(),
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

const cameraPermissionMock = jest.mocked(
  ImagePicker.requestCameraPermissionsAsync,
);
const galleryPermissionMock = jest.mocked(
  ImagePicker.requestMediaLibraryPermissionsAsync,
);
const launchCameraMock = jest.mocked(ImagePicker.launchCameraAsync);
const launchGalleryMock = jest.mocked(ImagePicker.launchImageLibraryAsync);

const permission = (
  status: "granted" | "denied",
  canAskAgain = true,
): ImagePicker.CameraPermissionResponse =>
  ({
    status,
    canAskAgain,
    granted: status === "granted",
    expires: "never",
  }) as unknown as ImagePicker.CameraPermissionResponse;

const success = (uri: string): ImagePicker.ImagePickerSuccessResult => ({
  canceled: false,
  assets: [{ uri, width: 100, height: 100 }],
});

const cancelled: ImagePicker.ImagePickerCanceledResult = {
  canceled: true,
  assets: null,
};

describe("takePhoto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCopy.mockResolvedValue(undefined);
  });

  test("returns denied with canAskAgain when camera permission is denied", async () => {
    cameraPermissionMock.mockResolvedValue(permission("denied", false));

    await expect(takePhoto()).resolves.toEqual({
      status: "denied",
      canAskAgain: false,
    });
    expect(launchCameraMock).not.toHaveBeenCalled();
    expect(mockCopy).not.toHaveBeenCalled();
  });

  test("copies the camera asset into the documents task-photos directory", async () => {
    cameraPermissionMock.mockResolvedValue(permission("granted"));
    launchCameraMock.mockResolvedValue(success("file:///cache/camera.jpg"));

    await expect(takePhoto()).resolves.toEqual({
      status: "granted",
      value: { uri: "file:///documents/task-photos/photo-id.jpg" },
    });
    expect(mockCopy).toHaveBeenCalledTimes(1);
  });

  test("returns mediaError when the camera picker throws", async () => {
    cameraPermissionMock.mockResolvedValue(permission("granted"));
    launchCameraMock.mockRejectedValue(new Error("camera failed"));

    await expect(takePhoto()).resolves.toEqual({
      status: "error",
      message: DEVICE_MESSAGES.mediaError,
    });
  });
});

describe("pickPhoto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCopy.mockResolvedValue(undefined);
  });

  test("returns cancelled when the gallery picker is cancelled", async () => {
    galleryPermissionMock.mockResolvedValue(permission("granted"));
    launchGalleryMock.mockResolvedValue(cancelled);

    await expect(pickPhoto()).resolves.toEqual({ status: "cancelled" });
    expect(mockCopy).not.toHaveBeenCalled();
  });

  test("returns mediaError when copying the picked file throws", async () => {
    galleryPermissionMock.mockResolvedValue(permission("granted"));
    launchGalleryMock.mockResolvedValue(success("file:///cache/gallery.jpg"));
    mockCopy.mockRejectedValueOnce(new Error("disk full"));

    await expect(pickPhoto()).resolves.toEqual({
      status: "error",
      message: DEVICE_MESSAGES.mediaError,
    });
  });
});

describe("deletePhoto", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("swallows a delete throw", () => {
    mockDelete.mockImplementationOnce(() => {
      throw new Error("already gone");
    });

    expect(() =>
      deletePhoto("file:///documents/task-photos/photo-id.jpg"),
    ).not.toThrow();
  });
});

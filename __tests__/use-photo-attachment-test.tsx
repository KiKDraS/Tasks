import { act, renderHook } from "@testing-library/react-native";

import { TASK_FORM_ACTION_TYPES } from "@/hooks/task-form/constants";
import { usePhotoAttachment } from "@/hooks/task-form/use-photo-attachment";
import { pickPhotos, takePhoto } from "@/services/media";

jest.mock("@/services/media", () => ({
  takePhoto: jest.fn(),
  pickPhotos: jest.fn(),
}));

const takePhotoMock = jest.mocked(takePhoto);
const pickPhotosMock = jest.mocked(pickPhotos);

const CAMERA_URI = "file:///photo-camera.jpg";
const GALLERY_URIS = ["file:///photo-1.jpg", "file:///photo-2.jpg"];

async function renderActions() {
  const dispatch = jest.fn();
  const utils = await renderHook(() => usePhotoAttachment({ dispatch }));

  return { ...utils, dispatch };
}

describe("usePhotoAttachment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("adds the camera photo as a one-item list", async () => {
    takePhotoMock.mockResolvedValue({
      status: "granted",
      value: { uri: CAMERA_URI },
    });
    const { result, dispatch } = await renderActions();

    await act(async () => {
      await result.current.takePhoto();
    });

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: TASK_FORM_ACTION_TYPES.SET_PHOTO_STATE,
      payload: { status: "pending" },
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: TASK_FORM_ACTION_TYPES.ADD_PHOTOS,
      payload: [CAMERA_URI],
    });
    expect(dispatch).toHaveBeenCalledTimes(2);
  });

  test("adds every gallery photo in a single action", async () => {
    pickPhotosMock.mockResolvedValue({
      status: "granted",
      value: { uris: GALLERY_URIS },
    });
    const { result, dispatch } = await renderActions();

    await act(async () => {
      await result.current.pickPhotos();
    });

    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: TASK_FORM_ACTION_TYPES.ADD_PHOTOS,
      payload: GALLERY_URIS,
    });
    expect(dispatch).toHaveBeenCalledTimes(2);
  });

  test("retry reuses the last photo source", async () => {
    takePhotoMock.mockResolvedValue({ status: "cancelled" });
    pickPhotosMock.mockResolvedValue({
      status: "granted",
      value: { uris: GALLERY_URIS },
    });
    const { result, dispatch } = await renderActions();

    await act(async () => {
      await result.current.takePhoto();
      await result.current.pickPhotos();
      await result.current.retryPhoto();
    });

    expect(takePhotoMock).toHaveBeenCalledTimes(1);
    expect(pickPhotosMock).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: TASK_FORM_ACTION_TYPES.ADD_PHOTOS,
      payload: GALLERY_URIS,
    });
  });

  test("removePhoto dispatches the removed uri", async () => {
    const { result, dispatch } = await renderActions();

    await act(async () => {
      result.current.removePhoto(GALLERY_URIS[0]);
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: TASK_FORM_ACTION_TYPES.REMOVE_PHOTO,
      payload: GALLERY_URIS[0],
    });
  });
});

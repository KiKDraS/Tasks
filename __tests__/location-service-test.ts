import * as Location from "expo-location";

import { DEVICE_MESSAGES } from "@/services/constants/device-messages";
import { getCurrentLocation } from "@/services/location";

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  reverseGeocodeAsync: jest.fn(),
  Accuracy: { Balanced: 3 },
}));

const permissionMock = jest.mocked(
  Location.requestForegroundPermissionsAsync,
);
const positionMock = jest.mocked(Location.getCurrentPositionAsync);
const reverseGeocodeMock = jest.mocked(Location.reverseGeocodeAsync);

const permission = (
  status: "granted" | "denied",
  canAskAgain = true,
): Location.LocationPermissionResponse =>
  ({
    status,
    canAskAgain,
    granted: status === "granted",
    expires: "never",
  }) as unknown as Location.LocationPermissionResponse;

const position: Location.LocationObject = {
  coords: {
    latitude: -34.6037,
    longitude: -58.3816,
    altitude: null,
    accuracy: 5,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  },
  timestamp: 1_780_000_000_000,
};

describe("getCurrentLocation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns denied with canAskAgain when permission is denied", async () => {
    permissionMock.mockResolvedValue(permission("denied", false));

    await expect(getCurrentLocation()).resolves.toEqual({
      status: "denied",
      canAskAgain: false,
    });
    expect(positionMock).not.toHaveBeenCalled();
  });

  test("returns granted with a formatted address", async () => {
    permissionMock.mockResolvedValue(permission("granted"));
    positionMock.mockResolvedValue(position);
    reverseGeocodeMock.mockResolvedValue([
      {
        name: "Casa",
        street: "Av. Siempreviva",
        streetNumber: "742",
        city: "Springfield",
        region: "Oregon",
        country: "Estados Unidos",
      },
    ] as unknown as Location.LocationGeocodedAddress[]);

    await expect(getCurrentLocation()).resolves.toEqual({
      status: "granted",
      value: {
        latitude: -34.6037,
        longitude: -58.3816,
        address:
          "Casa, Av. Siempreviva, 742, Springfield, Oregon, Estados Unidos",
      },
    });
  });

  test("returns granted with coordinates and no address when reverse geocoding rejects", async () => {
    permissionMock.mockResolvedValue(permission("granted"));
    positionMock.mockResolvedValue(position);
    reverseGeocodeMock.mockRejectedValue(new Error("geocoder unavailable"));

    await expect(getCurrentLocation()).resolves.toEqual({
      status: "granted",
      value: {
        latitude: -34.6037,
        longitude: -58.3816,
        address: undefined,
      },
    });
  });

  test("returns granted with coordinates and no address when reverse geocoding is empty", async () => {
    permissionMock.mockResolvedValue(permission("granted"));
    positionMock.mockResolvedValue(position);
    reverseGeocodeMock.mockResolvedValue([]);

    await expect(getCurrentLocation()).resolves.toEqual({
      status: "granted",
      value: {
        latitude: -34.6037,
        longitude: -58.3816,
        address: undefined,
      },
    });
  });

  test("returns locationError when getting the position throws", async () => {
    permissionMock.mockResolvedValue(permission("granted"));
    positionMock.mockRejectedValue(new Error("gps off"));

    await expect(getCurrentLocation()).resolves.toEqual({
      status: "error",
      message: DEVICE_MESSAGES.locationError,
    });
  });
});

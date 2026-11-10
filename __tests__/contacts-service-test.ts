import * as Contacts from "expo-contacts/legacy";

import { DEVICE_MESSAGES } from "@/services/constants/device-messages";
import { pickContact, type ContactSummary } from "@/services/contacts";

jest.mock("expo-contacts/legacy", () => ({
  requestPermissionsAsync: jest.fn(),
  presentContactPickerAsync: jest.fn(),
}));

const permissionMock = jest.mocked(Contacts.requestPermissionsAsync);
const pickerMock = jest.mocked(Contacts.presentContactPickerAsync);

const permission = (
  status: "granted" | "denied",
  canAskAgain = true,
): Awaited<ReturnType<typeof Contacts.requestPermissionsAsync>> =>
  ({
    status,
    canAskAgain,
    granted: status === "granted",
    expires: "never",
  }) as unknown as Awaited<
    ReturnType<typeof Contacts.requestPermissionsAsync>
  >;

const contact = (
  phoneNumbers?: Contacts.PhoneNumber[],
): Contacts.ExistingContact =>
  ({
    id: "contact-1",
    name: "Ana Pérez",
    phoneNumbers,
  }) as Contacts.ExistingContact;

const SUMMARY: ContactSummary = { id: "contact-1", name: "Ana Pérez" };

describe("pickContact", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns denied with canAskAgain when permission is denied", async () => {
    permissionMock.mockResolvedValue(permission("denied", false));

    await expect(pickContact()).resolves.toEqual({
      status: "denied",
      canAskAgain: false,
    });
    expect(pickerMock).not.toHaveBeenCalled();
  });

  test("returns cancelled when the picker resolves null", async () => {
    permissionMock.mockResolvedValue(permission("granted"));
    pickerMock.mockResolvedValue(null);

    await expect(pickContact()).resolves.toEqual({ status: "cancelled" });
  });

  test("omits phoneNumber when the contact has no phone numbers", async () => {
    permissionMock.mockResolvedValue(permission("granted"));
    pickerMock.mockResolvedValue(contact(undefined));

    const result = await pickContact();

    expect(result).toEqual({
      status: "granted",
      value: SUMMARY,
    });
    if (result.status === "granted") {
      expect("phoneNumber" in result.value).toBe(false);
    }
  });

  test("keeps the first phone number when the contact has several", async () => {
    permissionMock.mockResolvedValue(permission("granted"));
    pickerMock.mockResolvedValue(
      contact([
        { id: "phone-1", number: "11 5555-1111", label: "mobile" },
        { id: "phone-2", number: "11 5555-2222", label: "home" },
      ]),
    );

    await expect(pickContact()).resolves.toEqual({
      status: "granted",
      value: {
        ...SUMMARY,
        phoneNumber: "11 5555-1111",
      },
    });
  });

  test("returns contactsError when the picker throws", async () => {
    permissionMock.mockResolvedValue(permission("granted"));
    pickerMock.mockRejectedValue(new Error("contacts failed"));

    await expect(pickContact()).resolves.toEqual({
      status: "error",
      message: DEVICE_MESSAGES.contactsError,
    });
  });
});

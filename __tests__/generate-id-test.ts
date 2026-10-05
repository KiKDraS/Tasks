jest.mock("expo-crypto", () => ({
  randomUUID: jest.fn(),
}));

import * as Crypto from "expo-crypto";

import { generateId } from "@/utils/id";

describe("generateId", () => {
  test("delegates to Crypto.randomUUID", () => {
    const randomUUID = Crypto.randomUUID as jest.Mock;
    randomUUID.mockReturnValue("generated-id");

    expect(generateId()).toBe("generated-id");
    expect(randomUUID).toHaveBeenCalledTimes(1);
  });
});

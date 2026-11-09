import { formatContactLabel } from "@/utils/contact";

describe("formatContactLabel", () => {
  test("returns the name when there is no phone number", () => {
    expect(formatContactLabel({ id: "contact-1", name: "Ana Pérez" })).toBe(
      "Ana Pérez",
    );
  });

  test("joins the name and phone number", () => {
    expect(
      formatContactLabel({
        id: "contact-1",
        name: "Ana Pérez",
        phoneNumber: "11 5555-1111",
      }),
    ).toBe("Ana Pérez · 11 5555-1111");
  });
});

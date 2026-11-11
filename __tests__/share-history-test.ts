import type { TaskShare } from "@/context/tasks/types/Task";
import {
  formatShareCardLabel,
  formatShareDate,
  formatShareLabel,
  formatShareTarget,
} from "@/utils/share-history";

const SHARED_AT = "2026-11-09T14:30:00";

const buildShare = (overrides: Partial<TaskShare> = {}): TaskShare => ({
  method: "share",
  sharedAt: SHARED_AT,
  ...overrides,
});

describe("formatShareTarget", () => {
  test("maps Apple Mail and Message to Spanish labels", () => {
    expect(
      formatShareTarget(
        buildShare({ activityType: "com.apple.UIKit.activity.Mail" }),
      ),
    ).toBe("Mail");
    expect(
      formatShareTarget(
        buildShare({ activityType: "com.apple.UIKit.activity.Message" }),
      ),
    ).toBe("Mensajes");
  });

  test.each([
    ["com.apple.UIKit.activity.PostToFacebook", "Facebook"],
    ["com.apple.UIKit.activity.AddToReadingList", "Lista de lectura"],
    ["com.apple.UIKit.activity.Print", "Imprimir"],
  ])("maps %s to %s", (activityType, expected) => {
    expect(formatShareTarget(buildShare({ activityType }))).toBe(expected);
  });

  test("uses the last segment of a third-party activity type", () => {
    expect(
      formatShareTarget(
        buildShare({ activityType: "net.whatsapp.WhatsApp" }),
      ),
    ).toBe("WhatsApp");
    expect(
      formatShareTarget(
        buildShare({ activityType: "com.example.share.Channel" }),
      ),
    ).toBe("Channel");
  });

  test.each(["sharexcomponent", "ShareXComponent"])(
    "returns null for the raw activity id %p",
    (activityType) => {
      expect(formatShareTarget(buildShare({ activityType }))).toBeNull();
    },
  );

  test.each([undefined, "", "   "])(
    "returns null when the activity type is %p",
    (activityType) => {
      expect(formatShareTarget(buildShare({ activityType }))).toBeNull();
    },
  );
});

describe("formatShareLabel", () => {
  test("names the recipient and the target", () => {
    expect(
      formatShareLabel(
        buildShare({
          method: "contact",
          recipientName: "Ana Pérez",
          activityType: "net.whatsapp.WhatsApp",
        }),
      ),
    ).toBe("Compartida con Ana Pérez · WhatsApp");
  });

  test("falls back to the contact method when there is no target", () => {
    expect(
      formatShareLabel(
        buildShare({ method: "contact", recipientName: "Ana Pérez" }),
      ),
    ).toBe("Compartida con Ana Pérez · Contacto");
  });

  test("falls back to the contact method for a raw activity id", () => {
    expect(
      formatShareLabel(
        buildShare({
          method: "contact",
          recipientName: "Ana Pérez",
          activityType: "sharexcomponent",
        }),
      ),
    ).toBe("Compartida con Ana Pérez · Contacto");
  });

  test("renders a generic share without a target for a raw activity id", () => {
    expect(
      formatShareLabel(
        buildShare({ method: "share", activityType: "sharexcomponent" }),
      ),
    ).toBe("Compartida");
  });

  test("renders a generic share with its target", () => {
    expect(
      formatShareLabel(buildShare({ activityType: "net.whatsapp.WhatsApp" })),
    ).toBe("Compartida · WhatsApp");
  });

  test("renders a generic share without a target", () => {
    expect(formatShareLabel(buildShare())).toBe("Compartida");
  });
});

describe("formatShareCardLabel", () => {
  test("returns null without a share", () => {
    expect(formatShareCardLabel(undefined)).toBeNull();
  });

  test("uses the share label for the task card", () => {
    expect(
      formatShareCardLabel(
        buildShare({
          method: "contact",
          recipientName: "Ana Pérez",
          activityType: "net.whatsapp.WhatsApp",
        }),
      ),
    ).toBe("Compartida con Ana Pérez · WhatsApp");
  });
});

describe("formatShareDate", () => {
  test("formats the share timestamp in Spanish", () => {
    expect(formatShareDate(SHARED_AT)).toBe("9 nov 2026, 14:30");
  });

  test("returns an empty string for an invalid date", () => {
    expect(formatShareDate("not-a-date")).toBe("");
  });
});

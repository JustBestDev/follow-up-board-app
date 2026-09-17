import { describe, expect, test } from "vitest";

import { contactStatuses, parseContactInput } from "./contact-input";

const validPayload = {
  name: "  คุณทดสอบ ใจดี  ",
  company: "บริษัท ทดสอบ จำกัด",
  email: "test@example.com",
  phone: "081-234-5678",
  channel: "LINE: test_user",
  interest: "ระบบทดสอบ",
  status: "new",
  followUp: "2026-09-20T10:00:00+07:00",
  note: "โน้ตทดสอบ",
};

describe("parseContactInput", () => {
  test("ข้อมูลครบถ้วนผ่านและตัดช่องว่างส่วนเกิน", () => {
    const result = parseContactInput(validPayload);

    expect(result).not.toBeNull();
    expect(result?.name).toBe("คุณทดสอบ ใจดี");
    expect(result?.email).toBe("test@example.com");
    expect(result?.status).toBe("new");
    expect(result?.followUp).toBeInstanceOf(Date);
  });

  test("รองรับทุกสถานะตาม spec", () => {
    for (const status of contactStatuses) {
      expect(parseContactInput({ ...validPayload, status })?.status).toBe(status);
    }
    expect(contactStatuses).toEqual(["new", "talking", "closed"]);
  });

  test("ไม่มีอีเมลหรืออีเมลว่างได้ค่า null", () => {
    const { email: _email, ...withoutEmail } = validPayload;
    void _email;
    expect(parseContactInput(withoutEmail)?.email).toBeNull();
    expect(parseContactInput({ ...validPayload, email: "   " })?.email).toBeNull();
    expect(parseContactInput({ ...validPayload, email: null })?.email).toBeNull();
  });

  test("ฟิลด์บังคับหายหรือว่างไม่ผ่าน", () => {
    for (const field of ["name", "company", "phone", "channel", "interest", "note"] as const) {
      expect(parseContactInput({ ...validPayload, [field]: "" })).toBeNull();
      const { [field]: _removed, ...rest } = validPayload;
      void _removed;
      expect(parseContactInput(rest)).toBeNull();
    }
  });

  test("สถานะนอก spec ไม่ผ่าน", () => {
    expect(parseContactInput({ ...validPayload, status: "followup" })).toBeNull();
    expect(parseContactInput({ ...validPayload, status: undefined })).toBeNull();
  });

  test("วันที่ follow-up ไม่ถูกต้องไม่ผ่าน", () => {
    expect(parseContactInput({ ...validPayload, followUp: "not-a-date" })).toBeNull();
    expect(parseContactInput({ ...validPayload, followUp: 123 })).toBeNull();
    expect(parseContactInput({ ...validPayload })).not.toBeNull();
  });

  test("อีเมลไม่ใช่ string ไม่ผ่าน และ input ไม่ใช่ object ไม่ผ่าน", () => {
    expect(parseContactInput({ ...validPayload, email: 123 })).toBeNull();
    expect(parseContactInput(null)).toBeNull();
    expect(parseContactInput("contact")).toBeNull();
    expect(parseContactInput([])).toBeNull();
  });
});

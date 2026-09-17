import { beforeEach, describe, expect, test, vi } from "vitest";

import { DELETE, PATCH } from "./route";

const { mockGetSession, mockUpdateMany, mockFindFirst, mockDeleteMany } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockUpdateMany: vi.fn(),
  mockFindFirst: vi.fn(),
  mockDeleteMany: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mockGetSession } },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    contact: {
      updateMany: mockUpdateMany,
      findFirst: mockFindFirst,
      deleteMany: mockDeleteMany,
    },
  },
}));

const session = { user: { id: "user-1" } };
const context = { params: Promise.resolve({ id: "contact-1" }) };

const validPayload = {
  name: "คุณทดสอบ ใจดี",
  company: "บริษัท ทดสอบ จำกัด",
  phone: "081-234-5678",
  channel: "โทรศัพท์",
  interest: "ระบบทดสอบ",
  status: "closed",
  followUp: "2026-09-20T10:00:00+07:00",
  note: "โน้ตทดสอบ",
};

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/contacts/contact-1", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PATCH /api/contacts/[id]", () => {
  test("ไม่มี session ได้ 401", async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await PATCH(jsonRequest(validPayload), context);

    expect(response.status).toBe(401);
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  test("ข้อมูลไม่ถูกต้องได้ 400", async () => {
    mockGetSession.mockResolvedValue(session);

    const response = await PATCH(jsonRequest({ status: "followup" }), context);

    expect(response.status).toBe(400);
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  test("ไม่ใช่ของตัวเองได้ 404", async () => {
    mockGetSession.mockResolvedValue(session);
    mockUpdateMany.mockResolvedValue({ count: 0 });

    const response = await PATCH(jsonRequest(validPayload), context);

    expect(response.status).toBe(404);
    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: { id: "contact-1", userId: "user-1" },
      data: expect.objectContaining({ status: "closed" }),
    });
    expect(mockFindFirst).not.toHaveBeenCalled();
  });

  test("ของตัวเองอัปเดตสำเร็จได้ 200", async () => {
    mockGetSession.mockResolvedValue(session);
    mockUpdateMany.mockResolvedValue({ count: 1 });
    mockFindFirst.mockResolvedValue({ id: "contact-1", status: "closed" });

    const response = await PATCH(jsonRequest(validPayload), context);

    expect(response.status).toBe(200);
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: "contact-1", userId: "user-1" },
    });
    expect(await response.json()).toEqual({ id: "contact-1", status: "closed" });
  });
});

describe("DELETE /api/contacts/[id]", () => {
  test("ไม่มี session ได้ 401", async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await DELETE(new Request("http://localhost/api/contacts/contact-1"), context);

    expect(response.status).toBe(401);
    expect(mockDeleteMany).not.toHaveBeenCalled();
  });

  test("ไม่ใช่ของตัวเองได้ 404", async () => {
    mockGetSession.mockResolvedValue(session);
    mockDeleteMany.mockResolvedValue({ count: 0 });

    const response = await DELETE(new Request("http://localhost/api/contacts/contact-1"), context);

    expect(response.status).toBe(404);
    expect(mockDeleteMany).toHaveBeenCalledWith({
      where: { id: "contact-1", userId: "user-1" },
    });
  });

  test("ของตัวเองลบสำเร็จได้ 204", async () => {
    mockGetSession.mockResolvedValue(session);
    mockDeleteMany.mockResolvedValue({ count: 1 });

    const response = await DELETE(new Request("http://localhost/api/contacts/contact-1"), context);

    expect(response.status).toBe(204);
  });
});

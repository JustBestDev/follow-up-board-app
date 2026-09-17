import { beforeEach, describe, expect, test, vi } from "vitest";

import { GET, POST } from "./route";

const { mockGetSession, mockFindMany, mockCreate } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockFindMany: vi.fn(),
  mockCreate: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: mockGetSession } },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: { contact: { findMany: mockFindMany, create: mockCreate } },
}));

const session = { user: { id: "user-1" } };

const validPayload = {
  name: "คุณทดสอบ ใจดี",
  company: "บริษัท ทดสอบ จำกัด",
  email: "test@example.com",
  phone: "081-234-5678",
  channel: "LINE: test_user",
  interest: "ระบบทดสอบ",
  status: "talking",
  followUp: "2026-09-20T10:00:00+07:00",
  note: "โน้ตทดสอบ",
};

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/contacts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/contacts", () => {
  test("ไม่มี session ได้ 401", async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await GET(new Request("http://localhost/api/contacts"));

    expect(response.status).toBe(401);
    expect(mockFindMany).not.toHaveBeenCalled();
  });

  test("คืนเฉพาะ contact ของตัวเองเรียงตาม follow-up", async () => {
    mockGetSession.mockResolvedValue(session);
    mockFindMany.mockResolvedValue([{ id: "contact-1" }]);

    const response = await GET(new Request("http://localhost/api/contacts"));

    expect(response.status).toBe(200);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      orderBy: { followUp: "asc" },
    });
    expect(await response.json()).toEqual([{ id: "contact-1" }]);
  });
});

describe("POST /api/contacts", () => {
  test("ไม่มี session ได้ 401", async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await POST(jsonRequest(validPayload));

    expect(response.status).toBe(401);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test("ข้อมูลไม่ครบได้ 400", async () => {
    mockGetSession.mockResolvedValue(session);

    const response = await POST(jsonRequest({ name: "" }));

    expect(response.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test("ข้อมูลถูกต้องสร้าง contact ผูก userId ได้ 201", async () => {
    mockGetSession.mockResolvedValue(session);
    mockCreate.mockResolvedValue({ id: "contact-1" });

    const response = await POST(jsonRequest(validPayload));

    expect(response.status).toBe(201);
    expect(mockCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ name: "คุณทดสอบ ใจดี", userId: "user-1" }),
    });
    expect(await response.json()).toEqual({ id: "contact-1" });
  });
});

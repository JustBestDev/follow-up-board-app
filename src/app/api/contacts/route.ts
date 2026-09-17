import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { parseContactInput } from "@/lib/contact-input";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contacts = await prisma.contact.findMany({
    where: { userId: session.user.id },
    orderBy: { followUp: "asc" },
  });

  return NextResponse.json(contacts);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const input = parseContactInput(await request.json().catch(() => null));
  if (!input) {
    return NextResponse.json({ error: "Invalid contact data" }, { status: 400 });
  }

  const contact = await prisma.contact.create({
    data: {
      ...input,
      userId: session.user.id,
    },
  });

  return NextResponse.json(contact, { status: 201 });
}

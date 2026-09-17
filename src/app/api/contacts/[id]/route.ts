import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { parseContactInput } from "@/lib/contact-input";
import { prisma } from "@/lib/prisma";

type ContactRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: ContactRouteContext) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const input = parseContactInput(await request.json().catch(() => null));
  if (!input) {
    return NextResponse.json({ error: "Invalid contact data" }, { status: 400 });
  }

  const { id } = await params;
  const result = await prisma.contact.updateMany({
    where: { id, userId: session.user.id },
    data: input,
  });

  if (!result.count) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  const contact = await prisma.contact.findFirst({
    where: { id, userId: session.user.id },
  });

  return NextResponse.json(contact);
}

export async function DELETE(request: Request, { params }: ContactRouteContext) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const result = await prisma.contact.deleteMany({
    where: { id, userId: session.user.id },
  });

  if (!result.count) {
    return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}

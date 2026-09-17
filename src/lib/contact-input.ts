export const contactStatuses = ["new", "talking", "closed"] as const;

export type ContactStatus = (typeof contactStatuses)[number];

export type ContactInput = {
  name: string;
  company: string;
  email: string | null;
  phone: string;
  channel: string;
  interest: string;
  status: ContactStatus;
  followUp: Date;
  note: string;
};

export function parseContactInput(value: unknown): ContactInput | null {
  if (!value || typeof value !== "object") return null;

  const input = value as Record<string, unknown>;
  const requiredFields = ["name", "company", "phone", "channel", "interest", "note"] as const;

  if (requiredFields.some((field) => typeof input[field] !== "string" || !input[field].trim())) {
    return null;
  }

  if (typeof input.status !== "string" || !contactStatuses.includes(input.status as ContactStatus)) {
    return null;
  }

  if (typeof input.followUp !== "string") return null;
  const followUp = new Date(input.followUp);
  if (Number.isNaN(followUp.getTime())) return null;

  if (input.email != null && typeof input.email !== "string") return null;

  return {
    name: (input.name as string).trim(),
    company: (input.company as string).trim(),
    email: typeof input.email === "string" && input.email.trim() ? input.email.trim() : null,
    phone: (input.phone as string).trim(),
    channel: (input.channel as string).trim(),
    interest: (input.interest as string).trim(),
    status: input.status as ContactStatus,
    followUp,
    note: (input.note as string).trim(),
  };
}

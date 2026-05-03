"use server";

import prisma from "@/lib/prisma";

export type Recipient = {
  id: string;
  name: string;
  email: string;
  type: "student" | "lecturer";
  department: string;
  yearSem?: number;
};

export type SendEmailPayload = {
  recipientIds: string[];
  subject: string;
  body: string;
};

export type SendEmailResult =
  | { success: true; sent: number }
  | { success: false; error: string };

// Fetch all recipients (students + lecturers with emails)
export async function getRecipients(): Promise<Recipient[]> {
  const students = await prisma.student.findMany({
    where: { email: { not: null } },
    select: {
      id: true,
      name: true,
      surname: true,
      email: true,
      yearSem: true,
      department: { select: { name: true } },
    },
    orderBy: { name: "asc" },
  });

  const lecturers = await prisma.lecturer.findMany({
    where: { email: { not: null } },
    select: {
      id: true,
      name: true,
      surname: true,
      email: true,
      title: true,
      department: { select: { name: true } },
    },
    orderBy: { name: "asc" },
  });

  const studentRecipients: Recipient[] = students.map((s) => ({
    id: s.id,
    name: `${s.name} ${s.surname}`,
    email: s.email!,
    type: "student",
    department: s.department.name,
    yearSem: s.yearSem,
  }));

  const lecturerRecipients: Recipient[] = lecturers.map((l) => ({
    id: l.id,
    name: `${l.title} ${l.name} ${l.surname}`,
    email: l.email!,
    type: "lecturer",
    department: l.department.name,
  }));

  return [...studentRecipients, ...lecturerRecipients];
}

export async function sendEmails(
  payload: SendEmailPayload,
): Promise<SendEmailResult> {
  const { recipientIds, subject, body } = payload;

  if (!recipientIds.length) {
    return { success: false, error: "No recipients selected." };
  }
  if (!subject.trim()) {
    return { success: false, error: "Subject is required." };
  }
  if (!body.trim()) {
    return { success: false, error: "Message body is required." };
  }

  // Resolve emails from DB
  const studentEmails = await prisma.student.findMany({
    where: { id: { in: recipientIds }, email: { not: null } },
    select: { email: true },
  });

  const lecturerEmails = await prisma.lecturer.findMany({
    where: { id: { in: recipientIds }, email: { not: null } },
    select: { email: true },
  });

  const emails = [
    ...studentEmails.map((s) => s.email!),
    ...lecturerEmails.map((l) => l.email!),
  ];

  if (!emails.length) {
    return { success: false, error: "None of the selected users have emails." };
  }

  // ── Send via Nodemailer ──────────────────────────────────────────────

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    bcc: emails,
    subject,
    text: body,
  });

  console.log(`[EMAIL] Sending to ${emails.length} recipients:`, emails);
  console.log(`[EMAIL] Subject: ${subject}`);

  return { success: true, sent: emails.length };
}

"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UserSex, LecturerTitle } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";

export type BulkDeleteLecturerResult =
  | { success: true; deleted: number; clerkFailed: string[] }
  | { success: false; error: string };

export type ImportLecturerRow = {
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  sex: UserSex;
  title: LecturerTitle;
  departmentId: number;
};

export type ImportLecturerResult =
  | { success: true; imported: number; skipped: number; errors: string[] }
  | { success: false; error: string };

const VALID_TITLES = ["Prof", "Dr", "Mr", "Mrs", "Ms"];

// ── Bulk Delete (with Clerk sync) ─────────────────────────────────────────────
export async function bulkDeleteLecturers(
  ids: string[],
): Promise<BulkDeleteLecturerResult> {
  if (!ids.length) return { success: false, error: "No lecturers selected." };

  await prisma.lecturer.deleteMany({ where: { id: { in: ids } } });

  const clerk = await clerkClient();
  const clerkFailed: string[] = [];

  for (const id of ids) {
    try {
      await clerk.users.deleteUser(id);
    } catch (err: any) {
      if (!err.message?.includes("User not found")) {
        console.error(`Clerk delete failed for lecturer ${id}:`, err.message);
        clerkFailed.push(id);
      }
    }
  }

  revalidatePath("/list/lecturers");
  return { success: true, deleted: ids.length, clerkFailed };
}

// ── Bulk Import (with Clerk sync) ─────────────────────────────────────────────
export async function importLecturers(
  rows: ImportLecturerRow[],
): Promise<ImportLecturerResult> {
  if (!rows.length) return { success: false, error: "No rows to import." };

  const errors: string[] = [];
  let imported = 0;
  let skipped = 0;

  const departments = await prisma.department.findMany({
    select: { id: true },
  });
  const validDeptIds = new Set(departments.map((d) => d.id));

  const clerk = await clerkClient();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowLabel = `Row ${i + 2}`;

    if (!row.username?.trim()) {
      errors.push(`${rowLabel}: username is required`);
      skipped++;
      continue;
    }
    if (!row.name?.trim()) {
      errors.push(`${rowLabel}: name is required`);
      skipped++;
      continue;
    }
    if (!row.surname?.trim()) {
      errors.push(`${rowLabel}: surname is required`);
      skipped++;
      continue;
    }
    if (!row.email?.trim()) {
      errors.push(`${rowLabel}: email is required for Clerk account`);
      skipped++;
      continue;
    }
    if (!row.phone?.trim()) {
      errors.push(`${rowLabel}: phone is required`);
      skipped++;
      continue;
    }
    if (!["MALE", "FEMALE"].includes(row.sex)) {
      errors.push(`${rowLabel}: sex must be MALE or FEMALE`);
      skipped++;
      continue;
    }
    if (!VALID_TITLES.includes(row.title)) {
      errors.push(
        `${rowLabel}: title must be one of ${VALID_TITLES.join(", ")}`,
      );
      skipped++;
      continue;
    }
    if (!validDeptIds.has(row.departmentId)) {
      errors.push(`${rowLabel}: department ID ${row.departmentId} not found`);
      skipped++;
      continue;
    }

    let clerkUser: any = null;

    try {
      clerkUser = await clerk.users.createUser({
        username: row.username.trim().toUpperCase(),
        password: row.username,
        firstName: row.name.trim(),
        lastName: row.surname.trim(),
        emailAddress: [row.email.trim()],
        publicMetadata: { role: "lecturer" },
      });
    } catch (clerkErr: any) {
      const msg =
        clerkErr.errors?.[0]?.message ??
        clerkErr.message ??
        "Unknown Clerk error";
      errors.push(`${rowLabel}: Clerk error — ${msg}`);
      skipped++;
      continue;
    }

    try {
      await prisma.lecturer.create({
        data: {
          id: clerkUser.id,
          username: row.username.trim().toUpperCase(),
          name: row.name.trim(),
          surname: row.surname.trim(),
          email: row.email.trim(),
          phone: row.phone.trim(),
          sex: row.sex,
          title: row.title,
          departmentId: row.departmentId,
        },
      });
      imported++;
    } catch (dbErr: unknown) {
      try {
        await clerk.users.deleteUser(clerkUser.id);
      } catch {}
      const msg = dbErr instanceof Error ? dbErr.message : String(dbErr);
      errors.push(
        msg.includes("Unique constraint")
          ? `${rowLabel}: username, email or phone already exists`
          : `${rowLabel}: DB error — ${msg}`,
      );
      skipped++;
    }
  }

  revalidatePath("/list/lecturers");
  return { success: true, imported, skipped, errors };
}

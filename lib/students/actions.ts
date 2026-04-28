"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma, UserSex } from "@prisma/client";
import { StudentSchema } from "../formValidationsSchemas";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = {
  success: boolean;
  error: boolean;
  message: string;
};

// ── Create ────────────────────────────────────────────────────────────────────
export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema,
) => {
  let createdUser: any = null;

  try {
    const clerk = await clerkClient();

    createdUser = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "student" },
    });

    await prisma.student.create({
      data: {
        id: createdUser.id,
        username: data.username.toUpperCase(),
        email: data.email ?? "",
        name: data.name
          .toLowerCase()
          .split(" ")
          .filter(Boolean)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        surname: data.surname,
        phone: data.phone?.trim() === "" ? null : data.phone?.trim(),
        sex: data.sex,
        yearSem: data.yearSem,
        subjects: {
          connect: data.subjects?.map((subjectId) => ({ id: subjectId })),
        },
        departmentId: data.departmentId,
        academicYearId: data.academicYearId,
      },
    });

    return {
      success: true,
      error: false,
      message: "Student has been created successfully.",
    };
  } catch (error: any) {
    console.error("Error creating student:", error);

    if (createdUser?.id) {
      try {
        const clerk = await clerkClient();
        await clerk.users.deleteUser(createdUser.id);
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }
    }

    let friendlyMessage = "Failed to create student.";
    if (error.code === "P2002") {
      const fields = (error.meta?.target as string[]) || [];
      if (fields.includes("username"))
        friendlyMessage = "Username already exists.";
      else if (fields.includes("phone"))
        friendlyMessage = "Phone number already exists.";
      else if (fields.includes("email"))
        friendlyMessage = "Email address already exists.";
      else
        friendlyMessage = "Duplicate data detected. Please use unique values.";
    } else if (error.errors?.[0]?.message) {
      friendlyMessage = error.errors[0].message;
    } else if (error.message?.includes("password")) {
      friendlyMessage = "Password does not meet security requirements.";
    }

    return { success: false, error: true, message: friendlyMessage };
  }
};

// ── Update ────────────────────────────────────────────────────────────────────
export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema,
) => {
  if (!data.id) {
    return { success: false, error: true, message: "Student ID is not found!" };
  }

  try {
    const clerk = await clerkClient();

    await clerk.users.updateUser(data.id, {
      username: data.username.toUpperCase(),
      ...(data.password ? { password: data.password } : {}),
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.student.update({
      where: { id: data.id },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username.toLocaleUpperCase(),
        email: data.email ?? "",
        name: data.name
          .toLowerCase()
          .split(" ")
          .filter(Boolean)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        surname: data.surname,
        phone: data.phone?.trim() === "" ? null : data.phone?.trim(),
        sex: data.sex,
        yearSem: data.yearSem,
        ...(data.subjects !== undefined
          ? { subjects: { set: data.subjects.map((id) => ({ id })) } }
          : {}),
        departmentId: data.departmentId,
        academicYearId: data.academicYearId,
      },
    });

    return {
      success: true,
      error: false,
      message: "Student has been updated successfully.",
    };
  } catch (error: any) {
    console.error("Error updating student:", error);

    let friendlyMessage = "Failed to update student.";
    if (error.code === "P2002") {
      const fields = (error.meta?.target as string[]) || [];
      if (fields.includes("username"))
        friendlyMessage = "Username already exists.";
      else if (fields.includes("phone"))
        friendlyMessage = "Phone number already exists.";
      else if (fields.includes("email"))
        friendlyMessage = "Email address already exists.";
      else
        friendlyMessage = "Duplicate data detected. Please use unique values.";
    } else if (error.message?.includes("password")) {
      friendlyMessage = "Password does not meet security requirements.";
    } else if (error.errors?.[0]?.message) {
      friendlyMessage = error.errors[0].message;
    }

    return { success: false, error: true, message: friendlyMessage };
  }
};

// ── Delete (single) ───────────────────────────────────────────────────────────
export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;
  if (!id)
    return { success: false, error: true, message: "Student ID is missing." };

  try {
    const clerk = await clerkClient();

    await prisma.student.delete({ where: { id } });

    // Delete from Clerk — wrapped separately so a missing Clerk user
    // doesn't fail the whole operation (DB record is already gone)
    try {
      await clerk.users.deleteUser(id);
    } catch (clerkError: any) {
      if (!clerkError.message?.includes("User not found")) {
        console.error("Clerk delete failed for student:", id, clerkError);
      }
    }

    return {
      success: true,
      error: false,
      message: "Student has been deleted successfully.",
    };
  } catch (error: any) {
    console.error("Error deleting student:", error);

    let friendlyMessage = "Failed to delete student.";
    if (error.code === "P2003") {
      friendlyMessage =
        "Cannot delete this student because it is linked to other records.";
    } else if (error.code === "P2025") {
      friendlyMessage = "Student not found in the database.";
    }

    return { success: false, error: true, message: friendlyMessage };
  }
};

// ── Types ─────────────────────────────────────────────────────────────────────
export type BulkDeleteResult =
  | { success: true; deleted: number; clerkFailed: string[] }
  | { success: false; error: string };

export type BulkYearSemResult =
  | { success: true; updated: number }
  | { success: false; error: string };

export type FilterParams = {
  departmentId?: number;
  academicYearId?: number;
  search?: string;
};

export type ImportStudentRow = {
  username: string;
  name: string;
  surname: string;
  email?: string;
  phone?: string;
  sex: UserSex;
  yearSem: number;
  departmentId: number;
  academicYearId: number;
};

export type ImportResult =
  | { success: true; imported: number; skipped: number; errors: string[] }
  | { success: false; error: string };

const VALID_YEAR_SEMS = [11, 12, 21, 22, 31, 32, 41, 42];

// ── Bulk Delete (with Clerk sync) ─────────────────────────────────────────────
// Strategy:
//   1. Delete DB records first (fast, transactional via deleteMany)
//   2. Delete each Clerk user individually — collect failures instead of throwing
//      because a missing Clerk user should not block the DB deletion result.
export async function bulkDeleteStudents(
  ids: string[],
): Promise<BulkDeleteResult> {
  if (!ids.length) return { success: false, error: "No students selected." };

  // Step 1: Delete from DB
  const { count } = await prisma.student.deleteMany({
    where: { id: { in: ids } },
  });

  // Step 2: Delete from Clerk — individual calls, collect failures
  const clerk = await clerkClient();
  const clerkFailed: string[] = [];

  for (const id of ids) {
    try {
      await clerk.users.deleteUser(id);
    } catch (err: any) {
      // "User not found" means already gone — not a real failure
      if (!err.message?.includes("User not found")) {
        console.error(`Clerk delete failed for ${id}:`, err.message);
        clerkFailed.push(id);
      }
    }
  }

  revalidatePath("/list/students");
  return { success: true, deleted: count, clerkFailed };
}

// ── Bulk YearSem Update by ID list ────────────────────────────────────────────
// No Clerk interaction needed — yearSem is DB-only.
export async function bulkUpdateYearSem(
  ids: string[],
  yearSem: number,
): Promise<BulkYearSemResult> {
  if (!ids.length) return { success: false, error: "No students selected." };
  if (!VALID_YEAR_SEMS.includes(yearSem))
    return { success: false, error: "Invalid year/semester value." };

  const { count } = await prisma.student.updateMany({
    where: { id: { in: ids } },
    data: { yearSem },
  });

  revalidatePath("/list/students");
  return { success: true, updated: count };
}

// ── Bulk YearSem Update by Filter ─────────────────────────────────────────────
// No Clerk interaction needed — yearSem is DB-only.
export async function bulkUpdateYearSemByFilter(
  filter: FilterParams,
  targetYearSem: number,
): Promise<BulkYearSemResult> {
  if (!VALID_YEAR_SEMS.includes(targetYearSem))
    return { success: false, error: "Invalid year/semester value." };

  const where: Prisma.StudentWhereInput = {};
  if (filter.departmentId) where.departmentId = filter.departmentId;
  if (filter.academicYearId) where.academicYearId = filter.academicYearId;
  if (filter.search) {
    where.OR = [
      { name: { contains: filter.search, mode: "insensitive" } },
      { username: { contains: filter.search, mode: "insensitive" } },
    ];
  }

  const { count } = await prisma.student.updateMany({
    where,
    data: { yearSem: targetYearSem },
  });

  revalidatePath("/list/students");
  return { success: true, updated: count };
}

// ── Bulk Import (with Clerk sync) ─────────────────────────────────────────────
// Strategy per row:
//   1. Create Clerk user → get real ID
//   2. Create DB record using Clerk ID
//   3. If DB fails → rollback Clerk user
//   4. Collect per-row errors, continue to next row (don't abort the whole batch)
//
// ⚠️  Clerk rate limit: free plan allows ~20 user creations/minute.
//     For large imports, consider batching with a delay or using Clerk's
//     bulk import API if available on your plan.
export async function importStudents(
  rows: ImportStudentRow[],
): Promise<ImportResult> {
  if (!rows.length) return { success: false, error: "No rows to import." };

  const errors: string[] = [];
  let imported = 0;
  let skipped = 0;

  // Pre-validate reference IDs in one pass before hitting Clerk at all
  const departments = await prisma.department.findMany({
    select: { id: true },
  });
  const validDeptIds = new Set(departments.map((d) => d.id));

  const academicYears = await prisma.academicYear.findMany({
    select: { id: true },
  });
  const validAcYearIds = new Set(academicYears.map((y) => y.id));

  const clerk = await clerkClient();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowLabel = `Row ${i + 2}`;

    // ── Validate row ──
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
    if (!["MALE", "FEMALE"].includes(row.sex)) {
      errors.push(`${rowLabel}: sex must be MALE or FEMALE`);
      skipped++;
      continue;
    }
    if (!VALID_YEAR_SEMS.includes(row.yearSem)) {
      errors.push(
        `${rowLabel}: yearSem must be one of 11,12,21,22,31,32,41,42`,
      );
      skipped++;
      continue;
    }
    if (!validDeptIds.has(row.departmentId)) {
      errors.push(`${rowLabel}: department ID ${row.departmentId} not found`);
      skipped++;
      continue;
    }
    if (!validAcYearIds.has(row.academicYearId)) {
      errors.push(
        `${rowLabel}: academic year ID ${row.academicYearId} not found`,
      );
      skipped++;
      continue;
    }
    if (!row.email?.trim()) {
      errors.push(`${rowLabel}: email is required for Clerk account creation`);
      skipped++;
      continue;
    }

    let clerkUser: any = null;

    // ── Step 1: Create Clerk user ──
    try {
      clerkUser = await clerk.users.createUser({
        username: row.username.trim().toUpperCase(),
        // Use email as temporary password basis — admin should reset later
        // Or add a password column to the CSV. Currently generates one.
        password: `Import@${Date.now()}${i}`,
        firstName: row.name.trim(),
        lastName: row.surname.trim(),
        emailAddress: [row.email.trim()],
        publicMetadata: { role: "student" },
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

    // ── Step 2: Create DB record using real Clerk ID ──
    try {
      await prisma.student.create({
        data: {
          id: clerkUser.id,
          username: row.username.trim().toUpperCase(),
          name: row.name.trim(),
          surname: row.surname.trim(),
          email: row.email.trim(),
          phone: row.phone?.trim() || null,
          sex: row.sex,
          yearSem: row.yearSem,
          departmentId: row.departmentId,
          academicYearId: row.academicYearId,
        },
      });
      imported++;
    } catch (dbErr: unknown) {
      // ── Step 3: Rollback Clerk user if DB fails ──
      try {
        await clerk.users.deleteUser(clerkUser.id);
      } catch (rollbackErr) {
        console.error(
          `${rowLabel}: Clerk rollback failed for ${clerkUser.id}`,
          rollbackErr,
        );
      }

      const msg = dbErr instanceof Error ? dbErr.message : String(dbErr);
      errors.push(
        msg.includes("Unique constraint")
          ? `${rowLabel}: username or email already exists`
          : `${rowLabel}: DB error — ${msg}`,
      );
      skipped++;
    }
  }

  revalidatePath("/list/students");
  return { success: true, imported, skipped, errors };
}

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

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema,
) => {
  let createdUser: any = null;

  console.log("Received data for creating student:", data);

  try {
    const clerk = await clerkClient();

    // Step 1: Create Clerk user
    createdUser = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "student" },
    });

    // Step 2: Create Student in DB
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
        yearSem: data.yearSem, // ← add this
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

    // Step 3: Rollback Clerk user if DB fails
    if (createdUser?.id) {
      try {
        const clerk = await clerkClient();
        await clerk.users.deleteUser(createdUser.id);
      } catch (rollbackError) {
        console.error(
          "Rollback failed (could not delete user from Clerk):",
          rollbackError,
        );
      }
    }

    // Step 4: Handle specific Prisma errors
    let friendlyMessage = "Failed to create student.";

    if (error.code === "P2002") {
      // Unique constraint failed
      const fields = (error.meta?.target as string[]) || [];
      if (fields.includes("username")) {
        friendlyMessage = "Username already exists.";
      } else if (fields.includes("phone")) {
        friendlyMessage = "Phone number already exists.";
      } else if (fields.includes("email")) {
        friendlyMessage = "Email address already exists.";
      } else {
        friendlyMessage = "Duplicate data detected. Please use unique values.";
      }
    } else if (error.errors?.[0]?.message) {
      // Clerk or Zod error
      friendlyMessage = error.errors[0].message;
    } else if (error.message?.includes("password")) {
      friendlyMessage = "Password does not meet security requirements.";
    }

    return {
      success: false,
      error: true,
      message: friendlyMessage,
    };
  }
};

export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema,
) => {
  if (!data.id) {
    return { success: false, error: true, message: "Student ID is not found!" };
  }

  try {
    const clerk = await clerkClient();

    // Step 1: Update Clerk user
    await clerk.users.updateUser(data.id, {
      username: data.username.toUpperCase(),
      ...(data.password ? { password: data.password } : {}),
      firstName: data.name,
      lastName: data.surname,
    });

    // Step 2: Update Student in Database
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
          ? {
              subjects: {
                set: data.subjects.map((subjectId) => ({ id: subjectId })),
              },
            }
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

    // Step 3: Handle friendly Prisma messages
    let friendlyMessage = "Failed to update student.";

    if (error.code === "P2002") {
      const fields = (error.meta?.target as string[]) || [];
      if (fields.includes("username")) {
        friendlyMessage = "Username already exists.";
      } else if (fields.includes("phone")) {
        friendlyMessage = "Phone number already exists.";
      } else if (fields.includes("email")) {
        friendlyMessage = "Email address already exists.";
      } else {
        friendlyMessage = "Duplicate data detected. Please use unique values.";
      }
    } else if (error.message?.includes("password")) {
      friendlyMessage = "Password does not meet security requirements.";
    } else if (error.errors?.[0]?.message) {
      friendlyMessage = error.errors[0].message;
    }

    return {
      success: false,
      error: true,
      message: friendlyMessage,
    };
  }
};

export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData,
) => {
  const id = data.get("id") as string;

  if (!id) {
    return { success: false, error: true, message: "Student ID is missing." };
  }

  try {
    const clerk = await clerkClient();

    // Step 1: Delete student record from DB
    await prisma.student.delete({
      where: { id },
    });

    // Step 2: Delete user from Clerk
    await clerk.users.deleteUser(id);

    return {
      success: true,
      error: false,
      message: "Student has been deleted successfully.",
    };
  } catch (error: any) {
    console.error("Error deleting student:", error);

    // Step 3: Friendly error handling
    let friendlyMessage = "Failed to delete student.";

    if (error.code === "P2003") {
      // Prisma Foreign key constraint error
      friendlyMessage =
        "Cannot delete this student because it is linked to other records (e.g., reservations or subjects).";
    } else if (error.message?.includes("User not found")) {
      friendlyMessage =
        "The student’s user account could not be found in Clerk.";
    } else if (error.code === "P2025") {
      friendlyMessage = "Student not found in the database.";
    }

    return {
      success: false,
      error: true,
      message: friendlyMessage,
    };
  }
};

export type BulkDeleteResult =
  | { success: true; deleted: number }
  | { success: false; error: string };

export type BulkYearSemResult =
  | { success: true; updated: number }
  | { success: false; error: string };

// Filter by department and/or academic year — matches the new schema
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

// ── Bulk Delete ───────────────────────────────────────────────────────────────
export async function bulkDeleteStudents(
  ids: string[],
): Promise<BulkDeleteResult> {
  if (!ids.length) return { success: false, error: "No students selected." };

  const { count } = await prisma.student.deleteMany({
    where: { id: { in: ids } },
  });

  revalidatePath("/list/students");
  return { success: true, deleted: count };
}

// ── Bulk YearSem Update by ID list (per-row selection) ────────────────────────
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
// Filters by department + academic year (new schema) — hits ALL matching rows,
// not just the current page.
export async function bulkUpdateYearSemByFilter(
  filter: FilterParams,
  targetYearSem: number,
): Promise<BulkYearSemResult> {
  if (!VALID_YEAR_SEMS.includes(targetYearSem))
    return { success: false, error: "Invalid year/semester value." };

  const where: Prisma.StudentWhereInput = {};

  if (filter.departmentId) {
    where.departmentId = filter.departmentId;
  }

  if (filter.academicYearId) {
    where.academicYearId = filter.academicYearId;
  }

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

// ── Bulk Import ───────────────────────────────────────────────────────────────
export async function importStudents(
  rows: ImportStudentRow[],
): Promise<ImportResult> {
  if (!rows.length) return { success: false, error: "No rows to import." };

  const errors: string[] = [];
  let imported = 0;
  let skipped = 0;

  const departments = await prisma.department.findMany({
    select: { id: true },
  });
  const validDeptIds = new Set(departments.map((d) => d.id));

  const academicYears = await prisma.academicYear.findMany({
    select: { id: true },
  });
  const validAcYearIds = new Set(academicYears.map((y) => y.id));

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
    if (!["MALE", "FEMALE"].includes(row.sex)) {
      errors.push(`${rowLabel}: sex must be MALE or FEMALE`);
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

    try {
      await prisma.student.create({
        data: {
          id: `import_${Date.now()}_${i}`,
          username: row.username.trim(),
          name: row.name.trim(),
          surname: row.surname.trim(),
          email: row.email?.trim() || null,
          phone: row.phone?.trim() || null,
          sex: row.sex,
          yearSem: row.yearSem || 11,
          departmentId: row.departmentId,
          academicYearId: row.academicYearId,
        },
      });
      imported++;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(
        msg.includes("Unique constraint")
          ? `${rowLabel}: username or email already exists`
          : `${rowLabel}: ${msg}`,
      );
      skipped++;
    }
  }

  revalidatePath("/list/students");
  return { success: true, imported, skipped, errors };
}

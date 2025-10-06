"use server";

import { prisma } from "@/lib/prisma";
import {
  BuildingSchema,
  DepartmentSchema,
  LectureRoomSchema,
  LecturerSchema,
  ReservationSchema,
  StudentSchema,
  SubjectSchema,
} from "./formValidationsSchemas";
import { clerkClient } from "@clerk/nextjs/server";
import { error } from "console";

type CurrentState = {
  success: boolean;
  error: boolean;
  message: string;
};

//Building

export const createBuilding = async (
  currentState: CurrentState,
  data: BuildingSchema
) => {
  try {
    await prisma.hall.create({
      data: {
        name: data.name,
      },
    });

    return {
      success: true,
      error: false,
      message: "Building has been created.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "A bulding added failed.",
    };
  }
};

export const updateBuilding = async (
  currentState: CurrentState,
  data: BuildingSchema
) => {
  console.log("Hello");
  try {
    await prisma.hall.update({
      where: {
        id: Number(data.id),
      },
      data: {
        name: data.name,
      },
    });

    return {
      success: true,
      error: false,
      message: "Building has been updated.",
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "A bulding updating failed.",
    };
  }
};

export const deleteBuilding = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.hall.delete({
      where: {
        id: parseInt(id),
      },
    });

    return {
      success: true,
      error: false,
      message: "Building has been deleted.",
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "A bulding deleting failed.",
    };
  }
};

//Lecturer

export const createLecturer = async (
  currentState: CurrentState,
  data: LecturerSchema
) => {
  const clerk = await clerkClient();

  try {
    // Step 1: Create Clerk user
    const user = await clerk.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "lecturer" },
    });

    try {
      // Step 2: Create Lecturer in DB
      await prisma.lecturer.create({
        data: {
          id: user.id,
          username: data.username,
          email: data.email ?? "",
          name: data.name,
          surname: data.surname,
          phone: data.phone,
          address: data.address,
          bloodType: data.bloodType,
          birthday: data.birthday,
          sex: data.sex,
          subjects: {
            connect: data.subjects?.map((subjectId) => ({
              id: subjectId,
            })),
          },
          departmentId: data.departmentId,
        },
      });

      return {
        success: true,
        error: false,
        message: "Lecturer has been created successfully.",
      };
    } catch (dbError: any) {
      // Rollback Clerk user if DB failed
      await clerk.users.deleteUser(user.id);

      console.error("Database creation failed:", dbError);

      // Prisma unique constraint errors
      let friendlyMessage = "A database error occurred.";

      if (dbError.code === "P2002") {
        const field = dbError.meta?.target?.[0];
        switch (field) {
          case "username":
            friendlyMessage = "That username is already taken.";
            break;
          case "email":
            friendlyMessage = "That email is already registered.";
            break;
          case "phone":
            friendlyMessage = "That phone number is already registered.";
            break;
          default:
            friendlyMessage = "A record with the same value already exists.";
        }
      }

      return {
        success: false,
        error: true,
        message: friendlyMessage,
      };
    }
  } catch (clerkError: any) {
    const clerkMsg =
      clerkError?.errors?.[0]?.message ||
      clerkError?.message ||
      "Failed to create Clerk user.";

    return {
      success: false,
      error: true,
      message: clerkMsg,
    };
  }
};

export const updateLecturer = async (
  currentState: CurrentState,
  data: LecturerSchema
) => {
  if (!data.id) {
    return {
      success: false,
      error: true,
      message: "Lecturer ID is not found!",
    };
  }

  try {
    const clerk = await clerkClient();

    // Step 1: Update Clerk user
    try {
      await clerk.users.updateUser(data.id, {
        username: data.username,
        ...(data.password ? { password: data.password } : {}),
        firstName: data.name,
        lastName: data.surname,
      });
    } catch (clerkError: any) {
      console.error("Clerk update failed:", clerkError);

      const clerkMsg =
        clerkError?.errors?.[0]?.message ||
        clerkError?.message ||
        "Failed to update Clerk user.";

      return {
        success: false,
        error: true,
        message: clerkMsg,
      };
    }

    // Step 2: Update database record
    try {
      await prisma.lecturer.update({
        where: {
          id: data.id,
        },
        data: {
          username: data.username,
          email: data.email ?? "",
          name: data.name,
          surname: data.surname,
          phone: data.phone,
          address: data.address,
          bloodType: data.bloodType,
          birthday: data.birthday,
          sex: data.sex,
          ...(data.subjects !== undefined
            ? {
                subjects: {
                  set: data.subjects.map((subjectId) => ({ id: subjectId })),
                },
              }
            : {}),
          departmentId: data.departmentId,
        },
      });

      return {
        success: true,
        error: false,
        message: "Lecturer has been updated successfully.",
      };
    } catch (dbError: any) {
      console.error("Database update failed:", dbError);

      let friendlyMessage = "A database error occurred while updating.";

      // Prisma unique constraint violation (e.g. duplicate phone, username, email)
      if (dbError.code === "P2002") {
        const field = dbError.meta?.target?.[0];
        switch (field) {
          case "username":
            friendlyMessage = "That username is already taken.";
            break;
          case "email":
            friendlyMessage = "That email is already registered.";
            break;
          case "phone":
            friendlyMessage = "That phone number is already registered.";
            break;
          default:
            friendlyMessage =
              "A record with the same value already exists in the database.";
        }
      }

      return {
        success: false,
        error: true,
        message: friendlyMessage,
      };
    }
  } catch (error: any) {
    console.error("Unexpected error during lecturer update:", error);
    return {
      success: false,
      error: true,
      message: "An unexpected error occurred while updating the lecturer.",
    };
  }
};

export const deleteLecturer = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  if (!id) {
    return {
      success: false,
      error: true,
      message: "Lecturer ID is missing.",
    };
  }

  try {
    // Step 1: Delete from Clerk first
    const clerk = await clerkClient();
    try {
      await clerk.users.deleteUser(id);
    } catch (clerkError: any) {
      console.error("Clerk deletion failed:", clerkError);

      const clerkMsg =
        clerkError?.errors?.[0]?.message ||
        clerkError?.message ||
        "Failed to delete lecturer from authentication service.";

      return {
        success: false,
        error: true,
        message: clerkMsg,
      };
    }

    // Step 2: Delete from your local DB
    try {
      await prisma.lecturer.delete({
        where: { id },
      });

      return {
        success: true,
        error: false,
        message: "Lecturer has been deleted successfully.",
      };
    } catch (dbError: any) {
      console.error("Database deletion failed:", dbError);

      let friendlyMessage = "Failed to delete lecturer from database.";

      // Prisma foreign key constraint (lecturer has reservations, etc.)
      if (dbError.code === "P2003") {
        const field = dbError.meta?.field_name;
        if (field?.includes("lecturerId")) {
          friendlyMessage =
            "Cannot delete this lecturer because they are linked to existing reservations.";
        } else {
          friendlyMessage =
            "This lecturer is linked to other records and cannot be deleted.";
        }
      }

      return {
        success: false,
        error: true,
        message: friendlyMessage,
      };
    }
  } catch (error: any) {
    console.error("Unexpected error during lecturer deletion:", error);
    return {
      success: false,
      error: true,
      message: "An unexpected error occurred while deleting the lecturer.",
    };
  }
};

//Student

export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  let createdUser: any = null;

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
        username: data.username,
        email: data.email ?? "",
        name: data.name,
        surname: data.surname,
        phone: data.phone ?? "",
        address: data.address,
        bloodType: data.bloodType,
        birthday: data.birthday,
        sex: data.sex,
        subjects: {
          connect: data.subjects?.map((subjectId) => ({
            id: subjectId,
          })),
        },
        departmentId: data.departmentId,
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
          rollbackError
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
  data: StudentSchema
) => {
  if (!data.id) {
    return { success: false, error: true, message: "Student ID is not found!" };
  }

  try {
    const clerk = await clerkClient();

    // Step 1: Update Clerk user
    await clerk.users.updateUser(data.id, {
      username: data.username,
      ...(data.password ? { password: data.password } : {}),
      firstName: data.name,
      lastName: data.surname,
    });

    // Step 2: Update Student in Database
    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        ...(data.password !== "" && { password: data.password }),
        username: data.username,
        email: data.email ?? "",
        name: data.name,
        surname: data.surname,
        phone: data.phone,
        address: data.address,
        bloodType: data.bloodType,
        birthday: data.birthday,
        sex: data.sex,
        ...(data.subjects !== undefined
          ? {
              subjects: {
                set: data.subjects.map((subjectId) => ({ id: subjectId })),
              },
            }
          : {}),
        departmentId: data.departmentId,
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
  data: FormData
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

//Lecture Romm
export const createLectureRoom = async (
  currentState: CurrentState,
  data: LectureRoomSchema
) => {
  try {
    await prisma.lectureRoom.create({
      data: {
        name: data.name,
        maxCapacity: data.maxCapacity,
        hallId: data.hallId,
      },
    });

    return {
      success: true,
      error: false,
      message: "Building has been created.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "A bulding added failed.",
    };
  }
};

export const updateLectureRoom = async (
  currentState: CurrentState,
  data: LectureRoomSchema
) => {
  try {
    await prisma.lectureRoom.update({
      where: {
        id: Number(data.id),
      },
      data: {
        name: data.name,
      },
    });

    return {
      success: true,
      error: false,
      message: "Building has been updated.",
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "A bulding updating failed.",
    };
  }
};

export const deleteLectureRoom = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.lectureRoom.delete({
      where: {
        id: parseInt(id),
      },
    });

    return {
      success: true,
      error: false,
      message: "Building has been deleted.",
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "A bulding deleting failed.",
    };
  }
};

//Department
export const createDepartment = async (
  currentState: CurrentState,
  data: DepartmentSchema
) => {
  try {
    await prisma.department.create({
      data: {
        name: data.name,
      },
    });

    return {
      success: true,
      error: false,
      message: "Department has been created.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "A department added failed.",
    };
  }
};

export const updateDepartment = async (
  currentState: CurrentState,
  data: DepartmentSchema
) => {
  try {
    await prisma.department.update({
      where: {
        id: Number(data.id),
      },
      data: {
        name: data.name,
      },
    });

    return {
      success: true,
      error: false,
      message: "Department has been updated.",
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "A department updating failed.",
    };
  }
};

export const deleteDepartment = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.department.delete({
      where: {
        id: parseInt(id),
      },
    });

    return {
      success: true,
      error: false,
      message: "Department has been deleted.",
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "A department deleting failed.",
    };
  }
};

//Subject
export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name,
        code: data.code,
        departmentId: data.departmentId,
      },
    });

    return {
      success: true,
      error: false,
      message: "Subject has been created.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "A subject added failed.",
    };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.update({
      where: {
        id: Number(data.id),
      },
      data: {
        name: data.name,
        code: data.code,
        departmentId: data.departmentId,
      },
    });

    return {
      success: true,
      error: false,
      message: "Subject has been updated.",
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "A subject updating failed.",
    };
  }
};

export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      },
    });

    return {
      success: true,
      error: false,
      message: "Subject has been deleted.",
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "A subject deleting failed.",
    };
  }
};

//Reservation
export const createReservation = async (
  currentState: CurrentState,
  data: ReservationSchema
) => {
  try {
    // Check for overlapping reservations in the same room
    const overlap = await prisma.reservation.findFirst({
      where: {
        lecRoomId: data.lecRoomId,
        OR: [
          {
            startTime: { lt: data.endTime },
            endTime: { gt: data.startTime },
          },
        ],
      },
    });

    if (overlap) {
      return {
        success: false,
        error: true,
        message: "This lecture room is already reserved for the selected time.",
      };
    }

    await prisma.reservation.create({
      data: {
        startTime: data.startTime,
        endTime: data.endTime,
        lecRoomId: data.lecRoomId,
        subjectId: data.subjectId,
        lecturerId: data.lecturerId,
      },
    });

    return {
      success: true,
      error: false,
      message: "Reservation has been created.",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: true,
      message: "Failed to create reservation.",
    };
  }
};

export const updateReservation = async (
  currentState: CurrentState,
  data: ReservationSchema
) => {
  try {
    await prisma.reservation.update({
      where: {
        id: Number(data.id),
      },
      data: {
        startTime: data.startTime,
        endTime: data.endTime,
        lecRoomId: data.lecRoomId,
        subjectId: data.subjectId,
        lecturerId: data.lecturerId,
      },
    });

    return {
      success: true,
      error: false,
      message: "Reservation has been updated.",
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "A reservation updating failed.",
    };
  }
};

export const deleteReservation = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.reservation.delete({
      where: {
        id: parseInt(id),
      },
    });

    return {
      success: true,
      error: false,
      message: "Reservation has been deleted.",
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "A reservation deleting failed.",
    };
  }
};

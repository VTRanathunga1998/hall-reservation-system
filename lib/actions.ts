"use server";

import { prisma } from "@/lib/prisma";
import {
  LecturerSchema,
  ReservationSchema,
  SelectSubjectSchema,
  SubjectSchema,
} from "./formValidationsSchemas";
import { clerkClient } from "@clerk/nextjs/server";

type CurrentState = {
  success: boolean;
  error: boolean;
  message: string;
};

//Lecturer
export const createLecturer = async (
  currentState: CurrentState,
  data: LecturerSchema,
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
          title: data.title,
          email: data.email ?? "",
          name: data.name
            .toLowerCase()
            .split(" ")
            .filter(Boolean)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          surname: data.surname,
          phone: data.phone,
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
  data: LecturerSchema,
) => {
  if (!data.id) {
    return {
      success: false,
      error: true,
      message: "Lecturer ID is not found!",
    };
  }

  console.log("Updating lecturer with data:", data);

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
          title: data.title,
          name: data.name
            .toLowerCase()
            .split(" ")
            .filter(Boolean)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          surname: data.surname,
          phone: data.phone,
          sex: data.sex,
          subjects: {
            set: (data.subjects ?? []).map((subjectId) => ({ id: subjectId })),
          },
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
  data: FormData,
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
    // STEP 1: Check reservations first
    const reservationCount = await prisma.reservation.count({
      where: {
        lecturerId: id,
      },
    });

    if (reservationCount > 0) {
      return {
        success: false,
        error: true,
        message:
          "Cannot delete this lecturer because they are linked to existing reservations.",
      };
    }

    // STEP 2: Delete from DB first
    await prisma.lecturer.delete({
      where: { id },
    });

    console.log(`Lecturer ${id} deleted from database.`);

    // STEP 3: Delete from Clerk
    try {
      const clerk = await clerkClient();
      await clerk.users.deleteUser(id);

      console.log(`Clerk user ${id} deleted.`);
    } catch (clerkError) {
      console.error("Clerk deletion failed:", clerkError);

      // DB already deleted — optional rollback could happen here
    }

    return {
      success: true,
      error: false,
      message: "Lecturer has been deleted successfully.",
    };
  } catch (error: any) {
    console.error("Delete lecturer error:", error);

    return {
      success: false,
      error: true,
      message: "Failed to delete lecturer.",
    };
  }
};

//Subject
export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema,
) => {
  try {
    await prisma.subject.create({
      data: {
        name: data.name
          .toLowerCase()
          .split(" ")
          .filter(Boolean)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        code: data.code,
        credit: data.credit,
        departmentId: data.departmentId,
      },
    });

    return {
      success: true,
      error: false,
      message: "Subject has been created.",
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "A subject added failed.",
    };
  }
};

export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema,
) => {
  try {
    await prisma.subject.update({
      where: {
        id: Number(data.id),
      },
      data: {
        name: data.name
          .toLowerCase()
          .split(" ")
          .filter(Boolean)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
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
  data: FormData,
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

export const selectSubject = async (
  currentState: CurrentState,
  data: SelectSubjectSchema,
) => {
  try {
    if (!data.id) {
      return {
        success: false,
        error: true,
        message: "User ID is required.",
      };
    }

    if (!Array.isArray(data.subjectIds) || data.subjectIds.length === 0) {
      return {
        success: false,
        error: true,
        message: "Please select at least one subject.",
      };
    }

    // Handle student
    if (data.role === "student") {
      const student = await prisma.student.findUnique({
        where: { id: data.id },
        include: { subjects: { select: { id: true } } },
      });

      if (!student) {
        return {
          success: false,
          error: true,
          message: "Student not found.",
        };
      }

      await prisma.student.update({
        where: { id: data.id },
        data: {
          subjects: {
            set: data.subjectIds.map((id) => ({ id })),
          },
        },
      });
    }
    // Handle lecturer
    else {
      const lecturer = await prisma.lecturer.findUnique({
        where: { id: data.id },
        include: { subjects: { select: { id: true } } },
      });

      if (!lecturer) {
        return {
          success: false,
          error: true,
          message: "Lecturer not found.",
        };
      }

      await prisma.lecturer.update({
        where: { id: data.id },
        data: {
          subjects: {
            set: data.subjectIds.map((id) => ({ id })),
          },
        },
      });
    }

    return {
      success: true,
      error: false,
      message: `Successfully added ${data.subjectIds.length} subject(s).`,
    };
  } catch (error) {
    console.error("Error updating subjects:", error);
    return {
      success: false,
      error: true,
      message: "Failed to update subject enrollment.",
    };
  }
};

export const removeSubject = async (
  currentState: CurrentState,
  formData: FormData,
) => {
  const subjectId = Number(formData.get("id"));
  const userId = formData.get("userId") as string;
  const role = formData.get("role") as string;

  if (!subjectId || !userId || !role) {
    return {
      success: false,
      error: true,
      message: "Invalid user, subject, or role.",
    };
  }

  try {
    if (role === "student") {
      await prisma.student.update({
        where: { id: userId },
        data: {
          subjects: {
            disconnect: { id: subjectId },
          },
        },
      });
    } else if (role === "lecturer") {
      await prisma.lecturer.update({
        where: { id: userId },
        data: {
          subjects: {
            disconnect: { id: subjectId },
          },
        },
      });
    } else {
      return {
        success: false,
        error: true,
        message: "Invalid role.",
      };
    }

    return {
      success: true,
      error: false,
      message: "Subject removed successfully.",
    };
  } catch (error) {
    console.error("Error removing subject:", error);
    return {
      success: false,
      error: true,
      message: "Failed to remove subject.",
    };
  }
};

//Reservation
export const createReservation = async (
  currentState: CurrentState,
  data: ReservationSchema,
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
    return {
      success: false,
      error: true,
      message: "Failed to create reservation.",
    };
  }
};

export const updateReservation = async (
  currentState: CurrentState,
  data: ReservationSchema,
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
  data: FormData,
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

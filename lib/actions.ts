"use server";

import { prisma } from "@/lib/prisma";
import {
  BuildingSchema,
  DepartmentSchema,
  LectureRoomSchema,
  LecturerSchema,
} from "./formValidationsSchemas";
import { clerkClient } from "@clerk/nextjs/server";
import { error } from "console";

type CurrentState = {
  success: boolean;
  error: boolean;
  message: string;
};

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

export const createLecturer = async (
  currentState: CurrentState,
  data: LecturerSchema
) => {
  try {
    const clerk = await clerkClient();

    const user = clerk.users.createUser({
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata: { role: "lecturer" },
    });

    await prisma.lecturer.create({
      data: {
        id: (await user).id,
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
      message: "Lecturer has been created.",
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "A lecturer added failed.",
    };
  }
};

export const updateLecturer = async (
  currentState: CurrentState,
  data: LecturerSchema
) => {
  if (!data.id) {
    return { success: false, error: true, message: "Lecture ID is not found!" };
  }

  try {
    const clerk = await clerkClient();

    const user = clerk.users.updateUser(data.id, {
      username: data.username,
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
    });

    await prisma.lecturer.update({
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
      message: "Lecturer has been updated.",
    };
  } catch (error) {
    console.log("error");
    return {
      success: false,
      error: true,
      message: "A lecturer updating failed.",
    };
  }
};

export const deleteLecturer = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  try {
    await prisma.lecturer.delete({
      where: {
        id: id,
      },
    });

    return {
      success: true,
      error: false,
      message: "Lecturer has been deleted.",
    };
  } catch (error) {
    // console.log(error);
    return {
      success: false,
      error: true,
      message: "A lecturer deleting failed.",
    };
  }
};

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

"use server";

import { LectureRoomSchema } from "../formValidationsSchemas";
import { prisma } from "../prisma";

type CurrentState = {
  success: boolean;
  error: boolean;
  message: string;
};

//Lecture Room
export const createLectureRoom = async (
  currentState: CurrentState,
  data: LectureRoomSchema,
) => {
  try {
    await prisma.lectureRoom.create({
      data: {
        name: data.name,
        maxCapacity: data.maxCapacity,
      },
    });

    return {
      success: true,
      error: false,
      message: "Lecture room has been created.",
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "A lecture room added failed.",
    };
  }
};

export const updateLectureRoom = async (
  currentState: CurrentState,
  data: LectureRoomSchema,
) => {
  try {
    console.log("Updating lecture room with data:", data);

    await prisma.lectureRoom.update({
      where: {
        id: Number(data.id),
      },
      data: {
        name: data.name,
        maxCapacity: data.maxCapacity,
      },
    });

    return {
      success: true,
      error: false,
      message: "Lecture room has been updated.",
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "A lecture room updating failed.",
    };
  }
};

export const deleteLectureRoom = async (
  currentState: CurrentState,
  data: FormData,
) => {
  console.log(
    "Deleting lecture room with data:",
    Object.fromEntries(data.entries()),
  );

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
      message: "Lecture room has been deleted.",
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "A lecture room deleting failed.",
    };
  }
};

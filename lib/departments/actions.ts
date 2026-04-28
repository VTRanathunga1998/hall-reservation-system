"use server";

import { prisma } from "@/lib/prisma";
import { DepartmentSchema } from "@/lib/formValidationsSchemas";

type CurrentState = {
  success: boolean;
  error: boolean;
  message: string;
};

//Department
export const createDepartment = async (
  currentState: CurrentState,
  data: DepartmentSchema,
) => {
  try {

    console.log("Creating department with data:", data);

    await prisma.department.create({
      data: {
        name: data.name
          .toLowerCase()
          .split(" ")
          .filter(Boolean)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      },
    });

    return {
      success: true,
      error: false,
      message: "Department has been created.",
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "A department added failed.",
    };
  }
};

export const updateDepartment = async (
  currentState: CurrentState,
  data: DepartmentSchema,
) => {
  try {
    await prisma.department.update({
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
  data: FormData,
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

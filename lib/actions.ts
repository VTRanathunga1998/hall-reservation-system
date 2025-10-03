"use server";

import { prisma } from "@/lib/prisma";
import { BuildingSchema } from "./formValidationsSchemas";
import { revalidatePath } from "next/cache";

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
    console.log("error");
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
    // console.log(error);
    return {
      success: false,
      error: true,
      message: "A bulding deleting failed.",
    };
  }
};

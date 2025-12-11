// lib/prismaAction.ts
import prisma from "./prisma";

export async function runPrismaAction<T>(
  callback: () => Promise<T>
): Promise<T> {
  try {
    return await callback();
  } finally {
    // Prevents tiny leaks in long-running Vercel functions
    await prisma.$disconnect();
  }
}

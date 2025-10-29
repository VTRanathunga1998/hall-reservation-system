import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const deleted = await prisma.reservation.deleteMany({
    where: {
      endTime: { lt: oneWeekAgo },
    },
  });

  return NextResponse.json({
    message: `Deleted ${deleted.count} old reservations`,
  });
}

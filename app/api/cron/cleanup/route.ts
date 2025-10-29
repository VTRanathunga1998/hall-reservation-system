import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Check for Vercel Cron header
    const cronHeader = request.headers.get("x-vercel-cron");

    // Check for manual authorization header (for testing)
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    // Allow if it's from Vercel Cron OR has valid token
    const isVercelCron = cronHeader === "true";
    const hasValidToken = token && token === process.env.CRON_SECRET;

    if (!isVercelCron && !hasValidToken) {
      console.error("Unauthorized cleanup attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Starting cleanup of old reservations...");

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const deleted = await prisma.reservation.deleteMany({
      where: {
        endTime: { lt: oneWeekAgo },
      },
    });

    console.log(`Deleted ${deleted.count} old reservations`);

    return NextResponse.json({
      success: true,
      message: `Deleted ${deleted.count} old reservations`,
      deletedCount: deleted.count,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

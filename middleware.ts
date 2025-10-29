import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

const matchers = Object.keys(routeAccessMap).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

export default clerkMiddleware(async (auth, req) => {
  // Debug: Log the pathname
  console.log("🔍 Middleware hit:", req.nextUrl.pathname);

  // Check if it's a cron route - MUST be FIRST
  if (req.nextUrl.pathname.startsWith("/api/cron")) {
    console.log("✅ Cron route detected, skipping auth");
    return NextResponse.next();
  }

  console.log("🔐 Running auth check");
  const { sessionClaims } = await auth();

  const role = (sessionClaims?.metadata as { role?: string })?.role;

  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req) && !allowedRoles.includes(role!)) {
      console.log("❌ Access denied, redirecting");
      return NextResponse.redirect(new URL(`/home`, req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

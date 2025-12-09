// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { routeAccessMap } from "./lib/settings";
// import { NextResponse } from "next/server";

// const matchers = Object.keys(routeAccessMap).map((route) => ({
//   matcher: createRouteMatcher([route]),
//   allowedRoles: routeAccessMap[route],
// }));

// export default clerkMiddleware(async (auth, req) => {
//   // Check if it's a cron route - MUST be FIRST
//   if (req.nextUrl.pathname.startsWith("/api/cron")) {
//     console.log("Cron route detected, skipping auth");
//     return NextResponse.next();
//   }

//   const { sessionClaims } = await auth();

//   const role = (sessionClaims?.metadata as { role?: string })?.role;

//   for (const { matcher, allowedRoles } of matchers) {
//     if (matcher(req) && !allowedRoles.includes(role!)) {
//       console.log("Access denied, redirecting");
//       return NextResponse.redirect(new URL(`/home`, req.url));
//     }
//   }
// });

// export const config = {
//   matcher: [
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     "/(api|trpc)(.*)",
//   ],
// };

// app/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/gpa",
  "/home",
  "/profile",
  "/upcoming",
  "/list/:path*",
  // add any other protected routes here
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // Allow cron jobs
  if (req.nextUrl.pathname.startsWith("/api/cron")) {
    return NextResponse.next();
  }

  // If user is NOT signed in + trying to access a protected page → send to YOUR login page at /
  if (!userId && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // user is signed in → check role-based access
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (userId && role) {
    for (const [route, allowedRoles] of Object.entries(routeAccessMap)) {
      if (createRouteMatcher([route])(req) && !allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL("/home", req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

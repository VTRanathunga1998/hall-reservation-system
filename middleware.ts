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

// app/middleware.ts   ← Replace your entire file with this

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routeAccessMap } from "./lib/settings";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(Object.keys(routeAccessMap));

export default clerkMiddleware(async (auth, req) => {
  // Allow cron routes completely
  if (req.nextUrl.pathname.startsWith("/api/cron")) {
    return NextResponse.next();
  }

  // This is the correct way in 2025: await auth()
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // 1. If NO user → only redirect if trying to access a protected route
  if (!userId) {
    if (isProtectedRoute(req)) {
      // This sends them to Clerk's sign-in page and returns them back after login
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    return NextResponse.next();
  }

  // 2. User is signed in → check role
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;

  // If the route is protected and the user's role is not allowed → redirect to /home
  const matchedRoute = Object.keys(routeAccessMap).find((route) =>
    createRouteMatcher([route])(req)
  );

  if (matchedRoute && role && !routeAccessMap[matchedRoute].includes(role)) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Everything is fine → continue
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// we are getting our sign in dashboard using it
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/forum(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

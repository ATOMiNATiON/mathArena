import { defineMiddleware } from "astro/middleware";
import { getAuth } from "firebase-admin/auth";
import { app } from "./lib/firebase_server.ts";

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.decodedCookie = undefined;
  if (context.cookies.has("__session")) {
    const sessionCookie = context.cookies.get("__session")!;
    try {
      const auth = getAuth(app);
      context.locals.decodedCookie = await auth.verifySessionCookie(
        sessionCookie.value,
      );

      // TODO create a function that lazily gets/sets things in the user doc
    } catch {}
  }

  return await next();
});

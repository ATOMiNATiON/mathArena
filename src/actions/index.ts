import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getAuth } from "firebase-admin/auth";
import { app } from "../lib/firebase_server.ts";
import { updateScoreServer, getScoreServer } from "../lib/score_server.ts";
import { updateThemeServer, getThemeServer} from "../lib/background_server.ts";

const sessionTokenTTL =
    1000 * // s → ms
    60 * // m → s
    60 * // h → m
    24 * // d → h
    7; // 7 days

export const server = {
    register: defineAction({
        input: z.object({
            email: z.string(),
            password: z.string(),
            name: z.string(),
            idToken: z.string()
        }),
        handler: async ({ email, password, name }) => {
            const auth = getAuth(app);
            return await auth.createUser({
                    email,
                    password,
                    displayName: name,
            });
        }
    }),
    login: defineAction({
        input: z.object({
            idToken: z.string(),
        }),
        handler: async ({ idToken }, ctx) => {
            const auth = getAuth(app);
            await auth.verifyIdToken(idToken);

            const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: sessionTokenTTL })

            ctx.cookies.set("__session", sessionCookie, { path: "/" });

            return sessionCookie
        }
    }),
    logout: defineAction({
        handler: async (_, ctx) => {
            ctx.cookies.delete("__session", { path: "/" });
        }
    }),
    updateScore: defineAction({
        input: z.number(),
        handler: async (newScore, ctx) => {
            const session = ctx.cookies.get("__session")!
            return await updateScoreServer(session.value, newScore)
        }
    }),
    getScore: defineAction({
        handler: async (_, ctx) => {
            const session = ctx.cookies.get("__session")!
            return await getScoreServer(session.value)
        }
    }),
    updateTheme: defineAction({
        input: z.string(),
        handler: async (newTheme, ctx) => {
            const session = ctx.cookies.get("__session")!
            return await updateThemeServer(session.value, newTheme)
        }
    }),
    getTheme: defineAction({
        handler: async (_, ctx) => {
            const session = ctx.cookies.get("__session")!
            return await getThemeServer(session.value)
        }
    })
}

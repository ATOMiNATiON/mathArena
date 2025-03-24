import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getAuth } from "firebase-admin/auth";
import { app } from "../lib/firebase_server.ts";
import { incrementCorrectServer, incrementIncorrectServer, getScoreServer } from "../lib/score_server.ts";
import { updateThemeServer, getThemeServer} from "../lib/background_server.ts";
import { getAccuracyServer, getCorrectServer, getIncorrectServer } from "../lib/accuracy_server.ts";
import { getHighScoreUsersServer } from "../lib/leaderboard_server.ts";

const sessionTokenTTL = 1000 * 60 * 60 * 24 * 7; // 7 days

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
            
            try {
                const decodedToken = await auth.verifyIdToken(idToken);
                const user = await auth.getUser(decodedToken.uid);
                if (!user.emailVerified) {
                    throw new Error("Email is not verified. Please verify your email before logging in.");
                }
                const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: sessionTokenTTL });
                ctx.cookies.set("__session", sessionCookie, { path: "/", httpOnly: true, secure: true, sameSite: "strict" });
                return sessionCookie;
            } catch (error) {
                console.error("Login failed:", error);
                throw new Error("Authentication failed. Please try again.");
            }
        }
    }),
    logout: defineAction({
        handler: async (_, ctx) => {
            ctx.cookies.delete("__session", { path: "/" });
        }
    }),
    getScore: defineAction({
        handler: async (_, ctx) => {
            const session = ctx.cookies.get("__session");
            if (!session) throw new Error("Unauthorized");

            return await getScoreServer(session.value);
        }
    }),
    getHighScorePlayers: defineAction({
        handler: async (_) => {
            return await getHighScoreUsersServer();
        }
    }),
    updateTheme: defineAction({
        input: z.string(),
        handler: async (newTheme, ctx) => {
            const session = ctx.cookies.get("__session");
            if (!session) throw new Error("Unauthorized");

            return await updateThemeServer(session.value, newTheme);
        }
    }),
    getTheme: defineAction({
        handler: async (_, ctx) => {
            const session = ctx.cookies.get("__session");
            if (!session) throw new Error("Unauthorized");

            return await getThemeServer(session.value);
        }
    }),
    incrementCorrect: defineAction({
        handler: async (_, ctx) => {
            const session = ctx.cookies.get("__session")!
            return await incrementCorrectServer(session.value)
        }
    }),
    incrementIncorrect: defineAction({
        handler: async (_, ctx) => {
            const session = ctx.cookies.get("__session")!
            return await incrementIncorrectServer(session.value)
        }
    }),
    getAccuracy: defineAction({
        handler: async (_, ctx) => {
            const session = ctx.cookies.get("__session")!
            return await getAccuracyServer(session.value)
        }
    }),
    getCorrect: defineAction({
        handler: async(_, ctx) => {
            const session = ctx.cookies.get("__session")!
            return await getCorrectServer(session.value)
        }
    }),
    getIncorrect: defineAction({
        handler: async(_, ctx) => {
            const session = ctx.cookies.get("__session")!
            return await getIncorrectServer(session.value)
        }
    })
};

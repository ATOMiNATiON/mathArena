import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getAuth } from "firebase-admin/auth";
import { app } from "../lib/server";

export const server = {
    // remove this when we add real actions!
    serverTime: defineAction({
        handler: async () => {
            let now = new Date()
            return now.toISOString()
        }
    }),
    register: defineAction({
        input: z.object({
            email: z.string(),
            password: z.string(),
            name: z.string()
        }),
        handler: async ({ email, password, name }) => {
            email = email.toString();
            password = password.toString();
            name = name.toString();
            const auth = getAuth(app);
            try {
                await auth.createUser({
                    email,
                    password,
                    displayName: name,
                });
            } catch (error: any) {
                return new Response(
                    "Something went wrong",
                    { status: 400 }
                );
            }
        }})
}

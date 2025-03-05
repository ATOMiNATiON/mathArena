import { db, app } from "./firebase_server.ts";
import { getAuth } from "firebase-admin/auth";

const defaultBlue = "#2baced";

export async function getThemeServer(session: string): Promise<string> {
    // get the background theme from Firebase
    const auth = getAuth(app);
    try {
        const decodedCookie = await auth.verifySessionCookie(session);
        if (decodedCookie.uid) {
            const user_doc = await db.collection("(default)").doc(decodedCookie.uid).get();
            if (!user_doc.exists) return defaultBlue;
            else return user_doc.get("theme") || defaultBlue;
        }
    } catch {}
    throw new Error("Unauthorized");
}

export async function updateThemeServer(session: string, newTheme: string): Promise<void> {
    const auth = getAuth(app);
    try {
        const decodedCookie = await auth.verifySessionCookie(session);
        if (decodedCookie.uid) {
            await db.collection("(default)").doc(decodedCookie.uid).set({ theme: newTheme }, { merge: true });
        }
    } catch {}
}
import { db, app } from "../lib/firebase_server.ts";
import { getAuth } from "firebase-admin/auth";

export async function updateStatsServer(session: string, stats: {
    streak: number,
    sessionCorrect: number,
    totalCorrect: number,
    accuracy: number,
    achievements?: string[]
}): Promise<void> {
    console.log("Server receiving stats update:", stats);  // Debug log
    const auth = getAuth(app);
    try {
        const decodedCookie = await auth.verifySessionCookie(session);
        if (decodedCookie.uid) {
            const updateData = {
                currentStreak: stats.streak,
                sessionCorrect: stats.sessionCorrect,
                totalCorrect: stats.totalCorrect,
                accuracy: stats.accuracy,
                achievements: stats.achievements || []  // Always include achievements array
            };
            console.log("Saving to database:", updateData);  // Debug log
            await db.collection("(default)").doc(decodedCookie.uid).set(updateData, { merge: true });
        }
    } catch (error) {
        console.error("Error updating stats:", error);  // Debug log
    }
}


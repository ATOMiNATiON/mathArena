import { db, app } from "../lib/firebase_server.ts";
import { getAuth } from "firebase-admin/auth";
import { UserStats } from "./achievements.ts";
import { updateAchievementServer }  from "./achievements_server.ts";

export async function getScoreServer(session: string): Promise<number> {
    // get the score from Firebase
    const auth = getAuth(app);

    try {
        const decodedCookie = await auth.verifySessionCookie(session);

        if(decodedCookie.uid) {
            const user_doc = await db.collection("(default)").doc(decodedCookie.uid).get();
            if(!user_doc.exists) return 0;
            else return user_doc.get("score") || 0;
        }
    } catch {}

    throw new Error("Unauthorized");
}

export async function incrementCorrectServer(session: string): Promise<Partial<UserStats>> {
    const auth = getAuth(app);
    try {
        const decodedCookie = await auth.verifySessionCookie(session);

        if (decodedCookie.uid) {
            const user_doc = await db.collection("(default)").doc(decodedCookie.uid).get();
            let currentCorrectCount = 0;
            let currentIncorrectCount = 0;
            let currentScore = 0;
            let streak = 0;
            let currentAchievements = [];

            if (user_doc.exists) {
                currentCorrectCount = user_doc.get("totalCorrect") || 0;
                currentIncorrectCount = user_doc.get("totalIncorrect") || 0;
                currentScore = user_doc.get("score") || 0;
                streak = user_doc.get("streak") || 0;
                currentAchievements = user_doc.get("achievements") || [];
            }
            const result: Partial<UserStats> & { totalCorrect: number } = {
                totalCorrect: currentCorrectCount + 1,
                score: currentScore + 1,
                streak: streak + 1
            };

            result.accuracy = Math.round((result.totalCorrect / (result.totalCorrect + currentIncorrectCount)) * 100);

            const newAchievements: string [] = updateAchievementServer(result);
            let achievements = [...new Set([...currentAchievements, ...newAchievements])];
            result.achievements = achievements;

            await db.collection("(default)").doc(decodedCookie.uid).set(result, { merge: true });
            return result;
        }
        throw new Error("Unauthorized");
    } catch {
        throw new Error("Unauthorized");
    }
}

export async function incrementIncorrectServer(session: string): Promise<Partial<UserStats>> {
    const auth = getAuth(app);
    try {
        const decodedCookie = await auth.verifySessionCookie(session);

        if (decodedCookie.uid) {
            const user_doc = await db.collection("(default)").doc(decodedCookie.uid).get();
            let currentCorrectCount = 0;
            let currentIncorrectCount = 0;
            let currentScore = 0;
            if (user_doc.exists) {
                currentIncorrectCount = user_doc.get("totalIncorrect") || 0;
                currentCorrectCount = user_doc.get("totalCorrect") || 0;
                currentScore = user_doc.get("score") || 0;
            }
            const result: Partial<UserStats> & { totalIncorrect: number } = {
                totalIncorrect: currentIncorrectCount + 1,
                score: Math.max(currentScore - 1, 0),
                streak: 0
            };

            result.accuracy = Math.round((currentCorrectCount / (currentCorrectCount + result.totalIncorrect)) * 100);
            console.log(result);
            
            await db.collection("(default)").doc(decodedCookie.uid).set(result, { merge: true });
            return result;
        }
        throw new Error("Unauthorized");
    } catch {
        throw new Error("Unauthorized");
    }
}

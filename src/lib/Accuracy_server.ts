import { db, app } from "../lib/firebase_server.ts";
import { getAuth } from "firebase-admin/auth";

export async function getAccuracyServer(session: string): Promise<number> {
    // get the accuracy from Firebase
    const auth = getAuth(app);

    try {
        const decodedCookie = await auth.verifySessionCookie(session);
        if(decodedCookie.uid) {
            const user_doc = await db.collection("(default)").doc(decodedCookie.uid).get();
            if (!user_doc.exists) return 0;
            else return user_doc.get("accuracy") || 0;
        }
    } catch {}
    throw new Error("Unauthorized");
}

export async function getCorrectServer(session: string): Promise<number> {
    // get the correctCount from firebase
    const auth = getAuth(app);
    try {
        const decodedCookie = await auth.verifySessionCookie(session);
        if (decodedCookie.uid) {
            const user_doc = await db.collection("(default)").doc(decodedCookie.uid).get();
            if (!user_doc.exists) return 0;
            else return user_doc.get("correctCount") || 0;
        }
    } catch {}
    throw new Error("Unauthorized");
}

export async function getIncorrectServer(session: string): Promise<number> {
    // get the incorrectCount from firebase
    const auth = getAuth(app);
    try {
        const decodedCookie = await auth.verifySessionCookie(session);
        if (decodedCookie.uid) {
            const user_doc = await db.collection("(default)").doc(decodedCookie.uid).get();
            if (!user_doc.exists) return 0;
            else return user_doc.get("incorrectCount") || 0;
        }
    }
    catch {}
    throw new Error("Unauthorized");
}

export async function updateAccuracyServer(
    session: string, 
    newAccuracy: number,
    correctCount: number,
    incorrectCount: number
    ): Promise<void> {
    
    const auth = getAuth(app);
    try {
        const decodedCookie = await auth.verifySessionCookie(session);
        if (decodedCookie.uid) {
            await db.collection("(default)").doc(decodedCookie.uid).set(
                { accuracy: newAccuracy,
                  correctCount: correctCount,
                  incorrectCount: incorrectCount
                },
                { merge: true });
        }
    } catch {}
}

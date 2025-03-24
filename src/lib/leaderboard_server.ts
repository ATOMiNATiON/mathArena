import { db, app } from "../lib/firebase_server.ts";
import { getAuth } from 'firebase-admin/auth';
import { type User } from "./LeaderboardUsers"

export async function getHighScoreUsersServer(): Promise<User[]> {
    
    // Customize how many users can be displayed
    const NumberOfUsers = 5;
    const HighScoreUsers: User[] = [];

    // Retrieve Users' UID and Scores from Firestore
    const snapshot = await db.collection('(default)').orderBy("score", "desc").limit(NumberOfUsers).get();
    const uid_score_array =  snapshot.docs.map(doc => ({ uid: doc.id, score: doc.get("score")}));

    for (let user of uid_score_array) {
        
        try {

            const displayName = await getDisplayNameByUIDServer(user.uid);
            const score = user.score;

            const TopUser: User = {displayName: displayName, score: score};
            HighScoreUsers.push(TopUser);

        } catch {}

    }

    return HighScoreUsers
}

async function getDisplayNameByUIDServer(uid: string): Promise<string> {

    const auth = getAuth(app);
    
    try {

        const userRecord = auth.getUser(uid);
        return (await userRecord).displayName || "Unknown-User"

    } catch{}

    throw new Error("User Does Not Exist");

}

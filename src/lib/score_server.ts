import { db } from "./firebase_server.ts";
import { type DecodedIdToken, getAuth } from "firebase-admin/auth";

export async function getScoreServer(
  decodedCookie: DecodedIdToken,
): Promise<number> {
  // get the score from Firebase
  const user_doc = await db
    .collection("(default)")
    .doc(decodedCookie.uid)
    .get();
  if (!user_doc.exists) return 0;
  else return user_doc.get("score") || 0;
}

export async function updateScoreServer(
  decodedCookie: DecodedIdToken,
  newScore: number,
): Promise<void> {
  // 1. check that the `uid` is not fraudulent: get the `session_uid` from the `session` and check that they match
  // 2. update the document in Firestore with uid = {uid} to have score = {newScore}
  await db
    .collection("(default)")
    .doc(decodedCookie.uid)
    .set({ score: newScore }, { merge: true });
}

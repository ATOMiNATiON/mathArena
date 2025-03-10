import { db, app } from "./firebase_server.ts";
import { type DecodedIdToken, getAuth } from "firebase-admin/auth";

const defaultBlue = "#2baced";

export async function getThemeServer(
  decodedCookie: DecodedIdToken,
): Promise<string> {
  // get the background theme from Firebase
  const user_doc = await db
    .collection("(default)")
    .doc(decodedCookie.uid)
    .get();
  if (!user_doc.exists) return defaultBlue;
  else return user_doc.get("theme") || defaultBlue;
}

export async function updateThemeServer(
  decodedCookie: DecodedIdToken,
  newTheme: string,
): Promise<void> {
  await db
    .collection("(default)")
    .doc(decodedCookie.uid)
    .set({ theme: newTheme }, { merge: true });
}

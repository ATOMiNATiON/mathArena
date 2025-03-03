declare namespace App {
  interface Locals {
    decodedCookie: import("firebase-admin/auth").DecodedIdToken | undefined;
  }
}

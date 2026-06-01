"use client";

/**
 * Mock admin auth — there is NO end-user web account (users live in the mobile
 * app). The web's only authenticated surface is the admin console, gated by a
 * single admin login. This is a front-end-only stub backed by localStorage;
 * swap for a real session/JWT check when a backend exists.
 */
const KEY = "tmp_admin_session";

export function signInAdmin() {
  try {
    localStorage.setItem(KEY, "1");
  } catch {}
}

export function signOutAdmin() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

export function isAdminSignedIn(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { getAllowedEmails } from "@/lib/allowed-emails";
import { SUPER_ADMIN_EMAIL } from "@/lib/admin-config";

export async function handleGoogleSignIn(formData: FormData) {
  try {
    await signIn("google");
  } catch (error) {
    if (error instanceof AuthError) {
      console.error("NextAuth Error:", error.type);
    }
    throw error;
  }
}

export async function getRedirectPath(email: string): Promise<string> {
  if (email === SUPER_ADMIN_EMAIL) {
    return "/admin/dashboard";
  }

  const allowedEmails = await getAllowedEmails();
  if (allowedEmails.includes(email)) {
    return "/upload-materi";
  }

  return "/unauthorized";
}

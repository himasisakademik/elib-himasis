"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const SUPER_ADMIN_EMAIL = 'nabilzihni08@gmail.com';

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
    return "/upload-materi";
}

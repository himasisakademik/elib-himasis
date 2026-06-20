"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import fs from "fs/promises";
import path from "path";

const SUPER_ADMIN_EMAIL = "nabilzihni08@gmail.com";
const emailsFilePath = path.join(process.cwd(), "allowed-emails.json");

async function getAllowedEmails(): Promise<string[]> {
  try {
    const data = await fs.readFile(emailsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

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

import NextAuth, { type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import fs from "fs/promises";
import path from "path";

const SUPER_ADMIN_EMAIL = "andryalfarisi015";
const emailsFilePath = path.join(process.cwd(), "allowed-emails.json");

async function getAllowedEmails(): Promise<string[]> {
  try {
    const data = await fs.readFile(emailsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  trustHost: true,
  callbacks: {
    async signIn({ user }) {
      const email = user.email;
      if (!email) return false;

      if (email === SUPER_ADMIN_EMAIL) return true;

      const allowedEmails = await getAllowedEmails();
      if (allowedEmails.includes(email)) return true;

      return "/unauthorized";
    },
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

import { list, put } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";
import { blobMissingMessage, hasVercelBlobStore } from "@/lib/blob-config";

const localEmailsFilePath = path.join(process.cwd(), "allowed-emails.json");
const blobEmailsPath = "config/allowed-emails.json";

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeEmails(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(
      value
        .filter((email): email is string => typeof email === "string")
        .map(normalizeEmail)
        .filter(Boolean)
    )
  );
}

async function readLocalAllowedEmails(): Promise<string[]> {
  try {
    const data = await fs.readFile(localEmailsFilePath, "utf-8");
    return normalizeEmails(JSON.parse(data));
  } catch (error) {
    console.error("Failed to read local allowed emails:", error);
    return [];
  }
}

async function readBlobAllowedEmails(): Promise<string[] | null> {
  const result = await list({ prefix: blobEmailsPath, limit: 1 });
  const blob = result.blobs.find((item) => item.pathname === blobEmailsPath);

  if (!blob) return null;

  const response = await fetch(blob.downloadUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to read allowed emails from Blob: ${response.status}`);
  }

  return normalizeEmails(await response.json());
}

export async function getAllowedEmails(): Promise<string[]> {
  if (hasVercelBlobStore()) {
    const blobEmails = await readBlobAllowedEmails();
    if (blobEmails) return blobEmails;
  }

  return readLocalAllowedEmails();
}

export async function writeAllowedEmails(emails: string[]): Promise<string[]> {
  const normalizedEmails = normalizeEmails(emails);

  if (hasVercelBlobStore()) {
    await put(blobEmailsPath, JSON.stringify(normalizedEmails, null, 2), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
      cacheControlMaxAge: 0,
    });

    return normalizedEmails;
  }

  if (process.env.VERCEL) {
    throw new Error(blobMissingMessage);
  }

  await fs.writeFile(localEmailsFilePath, JSON.stringify(normalizedEmails, null, 2));
  return normalizedEmails;
}

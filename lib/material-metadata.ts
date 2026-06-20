import { del, list, put } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

export interface MaterialMetadata {
  name: string;
  mataKuliah?: string;
  semester?: string;
  penyusun?: string;
  category: string;
  originalFileName?: string;
  fileSize?: number;
  uploadTime: string;
  penerbit?: string;
  tahunTerbit?: string;
  deskripsi?: string;
  gdriveUrl?: string;
  downloadUrl?: string;
  tahun?: string;
}

const localJsonDir = path.join(process.cwd(), "uploads/e-lib/json");
const blobPrefix = "materials/json/";
const blobMarkerPath = `${blobPrefix}.initialized.json`;

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function metadataBlobPath(name: string) {
  return `${blobPrefix}${Buffer.from(name, "utf8").toString("base64url")}.json`;
}

function localMetadataPath(name: string) {
  const fileName = `${name}.json`;
  if (fileName.includes("/") || fileName.includes("\\") || fileName.includes("\0")) {
    throw new Error("Invalid metadata file name");
  }

  return path.join(localJsonDir, fileName);
}

async function listAllBlobs(prefix: string) {
  const blobs = [];
  let cursor: string | undefined;

  do {
    const result = await list({ prefix, cursor, limit: 1000 });
    blobs.push(...result.blobs);
    cursor = result.cursor;
  } while (cursor);

  return blobs;
}

async function findBlob(pathname: string) {
  const result = await list({ prefix: pathname, limit: 1 });
  return result.blobs.find((blob) => blob.pathname === pathname) ?? null;
}

async function readBlobJson<T>(downloadUrl: string): Promise<T> {
  const response = await fetch(downloadUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to read Blob metadata: ${response.status}`);
  }

  return response.json();
}

async function readLocalMetadataFile(name: string): Promise<MaterialMetadata | null> {
  try {
    const data = await fs.readFile(localMetadataPath(name), "utf-8");
    return JSON.parse(data) as MaterialMetadata;
  } catch {
    return null;
  }
}

async function readLocalMetadataList(): Promise<MaterialMetadata[]> {
  try {
    const entries = await fs.readdir(localJsonDir, { withFileTypes: true });
    const files = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".json"));

    const metadata = await Promise.all(
      files.map(async (file) => {
        try {
          const data = await fs.readFile(path.join(localJsonDir, file.name), "utf-8");
          return JSON.parse(data) as MaterialMetadata;
        } catch (error) {
          console.error("Failed to read local material metadata:", file.name, error);
          return null;
        }
      })
    );

    return metadata.filter((item): item is MaterialMetadata => Boolean(item));
  } catch (error) {
    console.error("Failed to list local material metadata:", error);
    return [];
  }
}

async function putBlobMetadata(metadata: MaterialMetadata) {
  await put(metadataBlobPath(metadata.name), JSON.stringify(metadata, null, 2), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
    cacheControlMaxAge: 0,
  });
}

async function markBlobInitialized() {
  await put(
    blobMarkerPath,
    JSON.stringify({ initializedAt: new Date().toISOString() }, null, 2),
    {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
      cacheControlMaxAge: 0,
    }
  );
}

async function ensureBlobInitialized() {
  if (!hasBlobToken()) return;

  const marker = await findBlob(blobMarkerPath);
  if (marker) return;

  const localMetadata = await readLocalMetadataList();
  await Promise.all(localMetadata.map((metadata) => putBlobMetadata(metadata)));
  await markBlobInitialized();
}

export async function getMaterialMetadata(name: string): Promise<MaterialMetadata | null> {
  if (hasBlobToken()) {
    await ensureBlobInitialized();
    const blob = await findBlob(metadataBlobPath(name));
    if (!blob) return null;

    return readBlobJson<MaterialMetadata>(blob.downloadUrl);
  }

  return readLocalMetadataFile(name);
}

export async function listMaterialMetadata(category: string): Promise<MaterialMetadata[]> {
  if (hasBlobToken()) {
    await ensureBlobInitialized();
    const blobs = await listAllBlobs(blobPrefix);
    const metadataBlobs = blobs.filter(
      (blob) => blob.pathname !== blobMarkerPath && blob.pathname.endsWith(".json")
    );

    const metadata = await Promise.all(
      metadataBlobs.map(async (blob) => {
        try {
          return await readBlobJson<MaterialMetadata>(blob.downloadUrl);
        } catch (error) {
          console.error("Failed to read Blob material metadata:", blob.pathname, error);
          return null;
        }
      })
    );

    return metadata.filter(
      (item): item is MaterialMetadata => item !== null && item.category === category
    );
  }

  const metadata = await readLocalMetadataList();
  return metadata.filter((item) => item.category === category);
}

export async function saveMaterialMetadata(
  metadata: MaterialMetadata,
  previousName?: string
): Promise<MaterialMetadata> {
  if (hasBlobToken()) {
    await ensureBlobInitialized();
    await putBlobMetadata(metadata);

    if (previousName && previousName !== metadata.name) {
      await deleteMaterialMetadata(previousName);
    }

    return metadata;
  }

  await fs.mkdir(localJsonDir, { recursive: true });
  await fs.writeFile(localMetadataPath(metadata.name), JSON.stringify(metadata, null, 2));

  if (previousName && previousName !== metadata.name) {
    await deleteMaterialMetadata(previousName);
  }

  return metadata;
}

export async function deleteMaterialMetadata(name: string): Promise<boolean> {
  if (hasBlobToken()) {
    await ensureBlobInitialized();
    const blob = await findBlob(metadataBlobPath(name));
    if (!blob) return false;

    await del(blob.url);
    return true;
  }

  try {
    await fs.unlink(localMetadataPath(name));
    return true;
  } catch (error: any) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

import { NextRequest, NextResponse } from "next/server";
import {
  deleteMaterialMetadata,
  getMaterialMetadata,
  listMaterialMetadata,
  saveMaterialMetadata,
  type MaterialMetadata,
} from "@/lib/material-metadata";

export const dynamic = "force-dynamic";

export const config = {
  api: {
    bodyParser: false,
  },
};

const allowedCategories = ["matkul", "umum"] as const;
type Category = (typeof allowedCategories)[number];

function isCategory(value: string): value is Category {
  return allowedCategories.includes(value as Category);
}

function getFormText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getJsonText(data: unknown, key: string) {
  if (!data || typeof data !== "object") return "";

  const value = (data as Record<string, unknown>)[key];
  return typeof value === "string" ? value.trim() : "";
}

function extractFileId(url: string) {
  const match = url.match(/\/d\/([^/]+)/);
  return match ? match[1] : null;
}

function buildDownloadUrl(gdriveUrl: string) {
  const fileId = extractFileId(gdriveUrl);
  return fileId
    ? `https://drive.google.com/uc?export=download&id=${fileId}`
    : null;
}

function buildLegacyDownloadUrl(fileName: string, category: string) {
  return `/api/downloadmateri?file=${encodeURIComponent(
    fileName,
  )}&category=${encodeURIComponent(category)}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = getFormText(formData, "name");
    const gdriveUrl = getFormText(formData, "gdriveUrl");
    const categoryValue = getFormText(formData, "category");

    if (!name || !gdriveUrl || !isCategory(categoryValue)) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 },
      );
    }

    const downloadUrl = buildDownloadUrl(gdriveUrl);

    if (!downloadUrl) {
      return NextResponse.json(
        { error: "Invalid Google Drive URL" },
        { status: 400 },
      );
    }

    const baseMetadata = {
      name,
      tahun: new Date().getFullYear().toString(),
      category: categoryValue,
      gdriveUrl,
      downloadUrl,
      uploadTime: new Date().toISOString(),
    };

    let metadata: MaterialMetadata;

    if (categoryValue === "matkul") {
      const mataKuliah = getFormText(formData, "mataKuliah");
      const semester = getFormText(formData, "semester");
      const penyusun = getFormText(formData, "penyusun");

      if (!mataKuliah || !semester || !penyusun) {
        return NextResponse.json(
          { error: 'Missing required fields for "matkul" category' },
          { status: 400 },
        );
      }

      metadata = {
        ...baseMetadata,
        mataKuliah,
        semester,
        penyusun,
      };
    } else {
      const penerbit = getFormText(formData, "penerbit");
      const tahunTerbit = getFormText(formData, "tahun_terbit");
      const deskripsi = getFormText(formData, "deskripsi");

      if (!penerbit || !tahunTerbit || !deskripsi) {
        return NextResponse.json(
          { error: 'Missing required fields for "umum" category' },
          { status: 400 },
        );
      }

      metadata = {
        ...baseMetadata,
        penerbit,
        tahunTerbit,
        deskripsi,
      };
    }

    await saveMaterialMetadata(metadata);

    return NextResponse.json({
      message: "File uploaded successfully",
      ...metadata,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const fileName = getJsonText(body, "fileName");

    if (!fileName) {
      return NextResponse.json(
        { error: "File name is required" },
        { status: 400 },
      );
    }

    const existingMetadata = await getMaterialMetadata(fileName);

    if (!existingMetadata) {
      return NextResponse.json({ error: "Metadata not found" }, { status: 404 });
    }

    const updatedData =
      body && typeof body === "object"
        ? { ...(body as Record<string, unknown>) }
        : {};

    delete updatedData.fileName;

    const categoryValue =
      getJsonText(updatedData, "category") || existingMetadata.category;

    if (!isCategory(categoryValue)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 },
      );
    }

    const name = getJsonText(updatedData, "name") || existingMetadata.name;
    const requestedGdriveUrl = getJsonText(updatedData, "gdriveUrl");
    const gdriveUrl = requestedGdriveUrl || existingMetadata.gdriveUrl || "";
    const downloadUrl = gdriveUrl
      ? buildDownloadUrl(gdriveUrl)
      : existingMetadata.downloadUrl || "";

    if (gdriveUrl && !downloadUrl) {
      return NextResponse.json(
        { error: "Invalid Google Drive URL" },
        { status: 400 },
      );
    }

    const metadata: MaterialMetadata = {
      ...existingMetadata,
      ...updatedData,
      name,
      category: categoryValue,
      gdriveUrl: gdriveUrl || undefined,
      downloadUrl: downloadUrl || undefined,
      originalFileName: existingMetadata.originalFileName || fileName,
      uploadTime:
        getJsonText(updatedData, "uploadTime") ||
        existingMetadata.uploadTime ||
        new Date().toISOString(),
    } as MaterialMetadata;

    await saveMaterialMetadata(metadata, fileName);

    return NextResponse.json({
      message: "Metadata updated successfully",
      data: metadata,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update metadata" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { file, category } = await request.json();

  if (!file || !category) {
    return NextResponse.json(
      { error: "Missing file or category parameter" },
      { status: 400 },
    );
  }

  try {
    await deleteMaterialMetadata(file);
    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete the file" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const categoryValue = request.nextUrl.searchParams.get("category") || "";

  if (!isCategory(categoryValue)) {
    return NextResponse.json(
      { error: "Invalid category" },
      { status: 400 },
    );
  }

  try {
    const metadataList = await listMaterialMetadata(categoryValue);
    const fileList = metadataList.map((metadata) => {
      const legacyFileName = metadata.originalFileName || metadata.name;
      const downloadUrl =
        metadata.downloadUrl ||
        metadata.gdriveUrl ||
        buildLegacyDownloadUrl(legacyFileName, categoryValue);

      return {
        name: metadata.name || "-",
        originalFileName: metadata.originalFileName || "",
        mataKuliah: metadata.mataKuliah || "-",
        semester: metadata.semester || "-",
        penyusun: metadata.penyusun || "-",
        tahun: metadata.tahun || "-",
        uploadTime: metadata.uploadTime || "-",
        gdriveUrl: metadata.gdriveUrl || "",
        downloadUrl,
        size: metadata.fileSize || "-",
        penerbit: metadata.penerbit || "-",
        tahunTerbit: metadata.tahunTerbit || "-",
        deskripsi: metadata.deskripsi || "-",
      };
    });

    return NextResponse.json(fileList);
  } catch (error) {
    console.error("Error reading metadata:", error);
    return NextResponse.json([]);
  }
}

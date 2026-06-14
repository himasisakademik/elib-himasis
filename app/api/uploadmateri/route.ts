import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir, readFile, rename } from "fs/promises";
import { join } from "path";
import fs from "fs";

interface Metadata {
  name: string;
  mataKuliah?: string;
  semester?: string;
  dosen?: string;
  category: string;
  originalFileName: string;
  fileSize: number;
  uploadTime: string;
  penerbit?: string;
  tahunTerbit?: string;
  deskripsi?: string;
  judulJurnal?: string;
  penulisJurnal?: string;
  penerbitJurnal?: string;
  tahunJurnal?: string;
  asalJurnal?: string;
  judulTA?: string;
  namaTA?: string;
  tahunTA?: string;
}

const uploadDir = join(process.cwd(), "uploads/e-lib");
const jsonDir = join(uploadDir, "json");

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const mataKuliah = formData.get("mataKuliah") as string;
    const semester = formData.get("semester") as string;
    const dosen = formData.get("dosen") as string;
    const category = formData.get("category") as string;

    if (!file || !name || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (category === "umum") {
      const penerbit = formData.get("penerbit") as string;
      const tahunTerbit = formData.get("tahun_terbit") as string;
      const deskripsi = formData.get("deskripsi") as string;

      if (!penerbit || !tahunTerbit || !deskripsi) {
        return NextResponse.json(
          { error: 'Missing required fields for "umum" category' },
          { status: 400 },
        );
      }

      const metadata: Metadata = {
        name,
        category,
        originalFileName: file.name,
        fileSize: file.size,
        uploadTime: new Date().toISOString(),
        penerbit,
        tahunTerbit,
        deskripsi,
      };

      const categoryDir = join(uploadDir, category);
      await mkdir(categoryDir, { recursive: true });

      const filePath = join(categoryDir, file.name);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      const metadataFilePath = join(jsonDir, `${file.name}.json`);
      await mkdir(jsonDir, { recursive: true });
      await writeFile(metadataFilePath, JSON.stringify(metadata));

      return NextResponse.json({
        message: "File uploaded successfully",
        fileName: file.name,
        ...metadata,
      });
    } else if (category === "jurnal") {
      const judulJurnal = formData.get("juduljurnal") as string;
      const penulisJurnal = formData.get("penulisjurnal") as string;
      const penerbitJurnal = formData.get("penerbitjurnal") as string;
      const tahunJurnal = formData.get("tahunjurnal") as string;
      const asalJurnal = formData.get("asaljurnal") as string;

      if (
        !judulJurnal ||
        !penulisJurnal ||
        !penerbitJurnal ||
        !tahunJurnal ||
        !asalJurnal
      ) {
        return NextResponse.json(
          { error: 'Missing required fields for "umum" category' },
          { status: 400 },
        );
      }

      const metadata: Metadata = {
        name,
        category,
        originalFileName: file.name,
        fileSize: file.size,
        uploadTime: new Date().toISOString(),
        judulJurnal,
        penulisJurnal,
        penerbitJurnal,
        tahunJurnal,
        asalJurnal,
      };

      const categoryDir = join(uploadDir, category);
      await mkdir(categoryDir, { recursive: true });

      const filePath = join(categoryDir, file.name);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      const metadataFilePath = join(jsonDir, `${file.name}.json`);
      await mkdir(jsonDir, { recursive: true });
      await writeFile(metadataFilePath, JSON.stringify(metadata));

      return NextResponse.json({
        message: "File uploaded successfully",
        fileName: file.name,
        ...metadata,
      });
    } else if (category === "tugas-akhir") {
      const judulTA = formData.get("judulta") as string;
      const namaTA = formData.get("namata") as string;
      const tahunTA = formData.get("tahunta") as string;

      if (!judulTA || !namaTA || !tahunTA) {
        return NextResponse.json(
          { error: 'Missing required fields for "umum" category' },
          { status: 400 },
        );
      }

      const metadata: Metadata = {
        name,
        category,
        originalFileName: file.name,
        fileSize: file.size,
        uploadTime: new Date().toISOString(),
        judulTA,
        namaTA,
        tahunTA,
      };

      const categoryDir = join(uploadDir, category);
      await mkdir(categoryDir, { recursive: true });

      const filePath = join(categoryDir, file.name);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      const metadataFilePath = join(jsonDir, `${file.name}.json`);
      await mkdir(jsonDir, { recursive: true });
      await writeFile(metadataFilePath, JSON.stringify(metadata));

      return NextResponse.json({
        message: "File uploaded successfully",
        fileName: file.name,
        ...metadata,
      });
    }

    const metadata: Metadata = {
      name,
      mataKuliah,
      semester,
      dosen,
      category,
      originalFileName: file.name,
      fileSize: file.size,
      uploadTime: new Date().toISOString(),
    };

    const categoryDir = join(uploadDir, category);
    await mkdir(categoryDir, { recursive: true });

    const filePath = join(categoryDir, file.name);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const metadataFilePath = join(jsonDir, `${file.name}.json`);
    await mkdir(jsonDir, { recursive: true });
    await writeFile(metadataFilePath, JSON.stringify(metadata));

    return NextResponse.json({
      message: "File uploaded successfully",
      fileName: file.name,
      ...metadata,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { fileName, ...updatedData } = await request.json();

  try {
    const existingMetadataPath = join(jsonDir, `${fileName}.json`);
    let existingMetadata = {};

    try {
      const metadataContent = await readFile(existingMetadataPath, "utf-8");
      existingMetadata = JSON.parse(metadataContent);
    } catch (error) {
      console.error("Error reading existing metadata:", error);
    }

    const oldFilePath = join(uploadDir, updatedData.category, fileName);
    const newFilePath = join(uploadDir, updatedData.category, updatedData.name);

    const metadataFilePath = join(jsonDir, `${fileName}.json`);
    const newMetadataFilePath = join(jsonDir, `${updatedData.name}.json`);

    const preservedUploadTime =
      updatedData.uploadTime ||
      (existingMetadata as any).uploadTime ||
      new Date().toISOString();

    const metadata = {
      ...updatedData,
      originalFileName: updatedData.name,
      uploadTime: preservedUploadTime,
    };

    if (fileName !== updatedData.name) {
      await rename(oldFilePath, newFilePath);
    } else {
    }

    await writeFile(newMetadataFilePath, JSON.stringify(metadata));

    if (fileName !== updatedData.name && fs.existsSync(metadataFilePath)) {
      await fs.promises.unlink(metadataFilePath);
    }

    return NextResponse.json({
      message: "File and metadata updated successfully",
      uploadTime: preservedUploadTime,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update file and metadata" },
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
    const filePath = join(uploadDir, category, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const metadataFilePath = join(jsonDir, `${file}.json`);
    if (fs.existsSync(metadataFilePath)) {
      fs.unlinkSync(metadataFilePath);
    }

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
  const category = request.nextUrl.searchParams.get("category");
  if (!category) {
    return NextResponse.json(
      { error: "Category is required" },
      { status: 400 },
    );
  }

  const allowedCategories = ["matkul", "jurnal", "tugas-akhir", "umum"];
  if (!allowedCategories.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const categoryDir = join(uploadDir, category);

  try {
    await mkdir(categoryDir, { recursive: true });

    const files = await readdir(categoryDir);

    const fileList: any[] = [];

    for (const file of files) {
      const filePath = join(categoryDir, file);

      let stats;
      try {
        stats = await fs.promises.stat(filePath);
      } catch {
        continue;
      }

      if (stats.isFile()) {
        const metadataFilePath = join(jsonDir, `${file}.json`);
        let metadata: Metadata = {
          name: "",
          mataKuliah: "",
          category: "",
          originalFileName: "",
          fileSize: 0,
          uploadTime: "",
          dosen: "",
          semester: "",
        };

        try {
          const metadataFile = await readFile(metadataFilePath, "utf-8");
          metadata = JSON.parse(metadataFile);
        } catch (err) {
          console.error("Error reading metadata for file", file);
        }

        fileList.push({
          name: file,
          mataKuliah: metadata.mataKuliah || "-",
          size: stats.size,
          semester: metadata.semester || "-",
          dosen: metadata.dosen || "-",
          uploadTime: metadata.uploadTime || "-",
          path: `/api/downloadmateri?file=${encodeURIComponent(file)}&category=${encodeURIComponent(category)}`,
          penerbit: metadata.penerbit || "-",
          tahunTerbit: metadata.tahunTerbit || "-",
          deskripsi: metadata.deskripsi || "-",
          judulJurnal: metadata.judulJurnal || "-",
          penulisJurnal: metadata.penulisJurnal || "-",
          penerbitJurnal: metadata.penerbitJurnal || "-",
          tahunJurnal: metadata.tahunJurnal || "-",
          asalJurnal: metadata.asalJurnal || "-",
          judulTA: metadata.judulTA || "-",
          namaTA: metadata.namaTA || "-",
          tahunTA: metadata.tahunTA || "-",
        });
      }
    }

    return NextResponse.json(fileList);
  } catch (error) {
    console.error("Error reading files for category:", category, error);
    return NextResponse.json([]);
  }
}

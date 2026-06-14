  import { NextRequest, NextResponse } from "next/server";
  import { writeFile, mkdir, readdir, readFile, rename } from "fs/promises";
  import { join } from "path";
  import fs from "fs";

  interface Metadata {
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

    // judulJurnal?: string;
    // penulisJurnal?: string;
    // penerbitJurnal?: string;
    // tahunJurnal?: string;
    // asalJurnal?: string;
    // judulTA?: string;
    // namaTA?: string;
    // tahunTA?: string;
    
    gdriveUrl?: string;
    downloadUrl?: string;
    tahun?: string;
  }

  const uploadDir = join(process.cwd(), "uploads/e-lib");
  const jsonDir = join(uploadDir, "json");

  export const config = {
    api: {
      bodyParser: false,
    },
  };

  function extractFileId(url: string) {
    const match = url.match(/\/d\/([^/]+)/);
    return match ? match[1] : null;
  }
  export async function POST(request: NextRequest) {
    try {
      const formData = await request.formData();

      const gdriveUrl = formData.get("gdriveUrl") as string;
      const name = formData.get("name") as string;
      const mataKuliah = formData.get("mataKuliah") as string;
      const semester = formData.get("semester") as string;
      const penyusun = formData.get("penyusun") as string;
      const category = formData.get("category") as string;
      // const tahun = formData.get("tahun") as string;

      const fileId = extractFileId(gdriveUrl);

      if (
        !name ||
        !mataKuliah ||
        !semester ||
        !penyusun ||
        // !tahun ||
        !gdriveUrl ||
        !category
      ) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      // if (!file || !name || !category) {
      //   return NextResponse.json(
      //     { error: "Missing required fields" },
      //     { status: 400 },
      //   );
      // }

      if (!fileId) {
        return NextResponse.json(
          { error: "Invalid Google Drive URL" },
          { status: 400 }
        );
      }

      const downloadUrl =
        `https://drive.google.com/uc?export=download&id=${fileId}`;

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
          mataKuliah,
          semester,
          penyusun,
          tahun: new Date().getFullYear().toString(),
          category,
          gdriveUrl,
          downloadUrl,
          uploadTime: new Date().toISOString(),
          penerbit,
          tahunTerbit,
          deskripsi,
        };

        await mkdir(jsonDir, { recursive: true });

        const metadataFilePath = join(jsonDir, `${name}.json`);

        await writeFile(
          metadataFilePath,
          JSON.stringify(metadata, null, 2)
        );

        return NextResponse.json({
          message: "Metadata saved successfully",
          ...metadata,
        });
      }

      // else if (category === "jurnal") {
      //   const judulJurnal = formData.get("juduljurnal") as string;
      //   const penulisJurnal = formData.get("penulisjurnal") as string;
      //   const penerbitJurnal = formData.get("penerbitjurnal") as string;
      //   const tahunJurnal = formData.get("tahunjurnal") as string;
      //   const asalJurnal = formData.get("asaljurnal") as string;
      //
      //   if (
      //     !judulJurnal ||
      //     !penulisJurnal ||
      //     !penerbitJurnal ||
      //     !tahunJurnal ||
      //     !asalJurnal
      //   ) {
      //     return NextResponse.json(
      //       { error: 'Missing required fields for "umum" category' },
      //       { status: 400 },
      //     );
      //   }
      // }

      // else if (category === "tugas-akhir") {
      //   const judulTA = formData.get("judulta") as string;
      //   const namaTA = formData.get("namata") as string;
      //   const tahunTA = formData.get("tahunta") as string;
      //
      //   if (!judulTA || !namaTA || !tahunTA) {
      //     return NextResponse.json(
      //       { error: 'Missing required fields for "umum" category' },
      //       { status: 400 },
      //     );
      //   }
      // }

      const metadata: Metadata = {
        name,
        mataKuliah,
        semester,
        penyusun,
        tahun: new Date().getFullYear().toString(),
        category,
        gdriveUrl,
        downloadUrl,
        uploadTime: new Date().toISOString(),
      };

      await mkdir(jsonDir, { recursive: true });

      const metadataFilePath = join(jsonDir, `${name}.json`);

      await writeFile(
        metadataFilePath,
        JSON.stringify(metadata, null, 2)
      );

      return NextResponse.json({
        message: "File uploaded successfully",
        ...metadata,
      });
    } catch (error) {
      console.error(error);

      return NextResponse.json(
        { error: "Server error" },
        { status: 500 }
      );
    }
  }

  export async function PUT(request: NextRequest) {
    const { fileName, ...updatedData } = await request.json();
  
    try {
      const existingMetadataPath = join(jsonDir, `${fileName}.json`);
      let existingMetadata: any = {};
  
      try {
        const metadataContent = await readFile(
          existingMetadataPath,
          "utf-8"
        );
  
        existingMetadata = JSON.parse(metadataContent);
      } catch (error) {
        console.error(
          "Error reading existing metadata:",
          error
        );
      }
  
      const preservedUploadTime =
        updatedData.uploadTime ||
        existingMetadata.uploadTime ||
        new Date().toISOString();
  
      const gdriveUrl =
        updatedData.gdriveUrl ||
        existingMetadata.gdriveUrl;
  
      let downloadUrl =
        existingMetadata.downloadUrl || "";
  
      if (gdriveUrl) {
        const fileId = extractFileId(gdriveUrl);
  
        if (fileId) {
          downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        }
      }
  
      const metadata = {
        ...existingMetadata,
        ...updatedData,
        gdriveUrl,
        downloadUrl,
        originalFileName: updatedData.name,
        uploadTime: preservedUploadTime,
      };
  
      const metadataFilePath = join(
        jsonDir,
        `${fileName}.json`
      );
  
      const newMetadataFilePath = join(
        jsonDir,
        `${updatedData.name}.json`
      );
  
      await writeFile(
        newMetadataFilePath,
        JSON.stringify(metadata, null, 2)
      );
  
      if (
        fileName !== updatedData.name &&
        fs.existsSync(metadataFilePath)
      ) {
        await fs.promises.unlink(metadataFilePath);
      }
  
      return NextResponse.json({
        message: "Metadata updated successfully",
        data: metadata,
      });
    } catch (error) {
      console.error(error);
  
      return NextResponse.json(
        { error: "Failed to update metadata" },
        { status: 500 }
      );
    }
  }

  // export async function PUT(request: NextRequest) {
  //   const { fileName, ...updatedData } = await request.json();

  //   try {
  //     const existingMetadataPath = join(jsonDir, `${fileName}.json`);
  //     let existingMetadata = {};

  //     try {
  //       const metadataContent = await readFile(existingMetadataPath, "utf-8");
  //       existingMetadata = JSON.parse(metadataContent);
  //     } catch (error) {
  //       console.error("Error reading existing metadata:", error);
  //     }

  //     const oldFilePath = join(uploadDir, updatedData.category, fileName);
  //     const newFilePath = join(uploadDir, updatedData.category, updatedData.name);

  //     const metadataFilePath = join(jsonDir, `${fileName}.json`);
  //     const newMetadataFilePath = join(jsonDir, `${updatedData.name}.json`);

  //     const preservedUploadTime =
  //       updatedData.uploadTime ||
  //       (existingMetadata as any).uploadTime ||
  //       new Date().toISOString();

  //     const metadata = {
  //       ...updatedData,
  //       originalFileName: updatedData.name,
  //       uploadTime: preservedUploadTime,
  //     };

  //     if (fileName !== updatedData.name) {
  //       await rename(oldFilePath, newFilePath);
  //     } else {
  //     }

  //     await writeFile(newMetadataFilePath, JSON.stringify(metadata));

  //     if (fileName !== updatedData.name && fs.existsSync(metadataFilePath)) {
  //       await fs.promises.unlink(metadataFilePath);
  //     }

  //     return NextResponse.json({
  //       message: "File and metadata updated successfully",
  //       uploadTime: preservedUploadTime,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     return NextResponse.json(
  //       { error: "Failed to update file and metadata" },
  //       { status: 500 },
  //     );
  //   }
  // }

  export async function DELETE(request: NextRequest) {
    const { file, category } = await request.json();

    if (!file || !category) {
      return NextResponse.json(
        { error: "Missing file or category parameter" },
        { status: 400 },
      );
    }

    try {
      // const filePath = join(uploadDir, category, file);
      // if (fs.existsSync(filePath)) {
      //   fs.unlinkSync(filePath);
      // }

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
        { status: 400 }
      );
    }

    const allowedCategories = ["matkul", "umum"];

    if (!allowedCategories.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category" },
        { status: 400 }
      );
    }

    try {
      await mkdir(jsonDir, { recursive: true });

      const metadataFiles = await readdir(jsonDir);

      const filePromises = metadataFiles.map(async (metadataFile) => {
        if (!metadataFile.endsWith(".json")) return null;

        try {
          const metadataPath = join(jsonDir, metadataFile);
          const metadataContent = await readFile(metadataPath, "utf-8");
          const metadata: Metadata = JSON.parse(metadataContent);

          if (metadata.category !== category) return null;

          return {
            name: metadata.name || "-",
            mataKuliah: metadata.mataKuliah || "-",
            semester: metadata.semester || "-",
            penyusun: metadata.penyusun || "-",
            tahun: metadata.tahun || "-",
            uploadTime: metadata.uploadTime || "-",
            gdriveUrl: metadata.gdriveUrl || "",
            downloadUrl: metadata.downloadUrl || "",
            size: metadata.fileSize || "-",
            penerbit: metadata.penerbit || "-",
            tahunTerbit: metadata.tahunTerbit || "-",
            deskripsi: metadata.deskripsi || "-",
          };
        } catch (err) {
          console.error("Error reading metadata:", metadataFile, err);
          return null;
        }
      });

      const results = await Promise.all(filePromises);
      const fileList = results.filter((item) => item !== null);

      return NextResponse.json(fileList);
    } catch (error) {
      console.error(
        "Error reading metadata:",
        error
      );

      return NextResponse.json([]);
    }
  }

  // export async function GET(request: NextRequest) {
  //   const category = request.nextUrl.searchParams.get("category");
  //   if (!category) {
  //     return NextResponse.json(
  //       { error: "Category is required" },
  //       { status: 400 },
  //     );
  //   }

  //   const allowedCategories = ["matkul", "umum"];
  //   if (!allowedCategories.includes(category)) {
  //     return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  //   }

  //   // const categoryDir = join(uploadDir, category);

  //   try {
  //     await mkdir(categoryDir, { recursive: true });

  //     // const files = await readdir(categoryDir);

  //     const fileList: any[] = [];

  //     for (const file of files) {
  //       const filePath = join(categoryDir, file);

  //       let stats;
  //       try {
  //         stats = await fs.promises.stat(filePath);
  //       } catch {
  //         continue;
  //       }

  //       if (stats.isFile()) {
  //         const metadataFilePath = join(jsonDir, `${file}.json`);
  //         let metadata: Metadata = {
  //           name: "",
  //           mataKuliah: "",
  //           category: "",
  //           originalFileName: "",
  //           fileSize: 0,
  //           uploadTime: "",
  //           penyusun: "",
  //           semester: "",
  //         };

  //         try {
  //           const metadataFile = await readFile(metadataFilePath, "utf-8");
  //           metadata = JSON.parse(metadataFile);
  //         } catch (err) {
  //           console.error("Error reading metadata for file", file);
  //         }

  //         fileList.push({
  //           name: file,
  //           mataKuliah: metadata.mataKuliah || "-",
  //           size: stats.size,
  //           semester: metadata.semester || "-",
  //           penyusun: metadata.penyusun || "-",
  //           uploadTime: metadata.uploadTime || "-",

  //           gdriveUrl: metadata.gdriveUrl || "",
  //           downloadUrl: metadata.downloadUrl || "",
            
  //           penerbit: metadata.penerbit || "-",
  //           tahunTerbit: metadata.tahunTerbit || "-",
  //           deskripsi: metadata.deskripsi || "-",
            
  //           // judulJurnal: metadata.judulJurnal || "-",
  //           // penulisJurnal: metadata.penulisJurnal || "-",
  //           // penerbitJurnal: metadata.penerbitJurnal || "-",
  //           // tahunJurnal: metadata.tahunJurnal || "-",
  //           // asalJurnal: metadata.asalJurnal || "-",
  //           // judulTA: metadata.judulTA || "-",
  //           // namaTA: metadata.namaTA || "-",
  //           // tahunTA: metadata.tahunTA || "-",

  //           // path: `/api/downloadmateri?file=${encodeURIComponent(file)}&category=${encodeURIComponent(category)}`,
  //         });
  //       }
  //     }

  //     return NextResponse.json(fileList);
  //   } catch (error) {
  //     console.error("Error reading files for category:", category, error);
  //     return NextResponse.json([]);
  //   }
  // }
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

        const metadata: MaterialMetadata = {
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

        await saveMaterialMetadata(metadata);

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

      const metadata: MaterialMetadata = {
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

      await saveMaterialMetadata(metadata);

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
      const existingMetadata: Partial<MaterialMetadata> =
        await getMaterialMetadata(fileName) ?? {};
  
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
  
      await saveMaterialMetadata(metadata as MaterialMetadata, fileName);
  
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
      const metadataList = await listMaterialMetadata(category);
      const fileList = metadataList.map((metadata) => ({
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
      }));

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

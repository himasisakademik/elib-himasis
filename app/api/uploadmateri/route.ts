import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readdir, readFile, rename } from 'fs/promises';
import { join } from 'path';
import fs from 'fs';

interface Metadata {
  name: string;
  semester?: string;
  dosen?: string;
  category: string;
  originalFileName: string;
  fileSize: number;
  uploadTime: string;
  penerbit?: string;  // Menambahkan penerbit untuk kategori umum
  tahunTerbit?: string;  // Menambahkan tahun terbit untuk kategori umum
  deskripsi?: string;  // Menambahkan deskripsi untuk kategori umum
}

const uploadDir = join(process.cwd(), 'uploads/e-lib');
const jsonDir = join(uploadDir, 'json');

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const semester = formData.get('semester') as string;
    const dosen = formData.get('dosen') as string;
    const category = formData.get('category') as string;

    if (!file || !name || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Menangani kategori umum
    if (category === "umum") {
      const penerbit = formData.get('penerbit') as string;
      const tahunTerbit = formData.get('tahun_terbit') as string;
      const deskripsi = formData.get('deskripsi') as string;

      if (!penerbit || !tahunTerbit || !deskripsi) {
        return NextResponse.json({ error: 'Missing required fields for "umum" category' }, { status: 400 });
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

      // Buat direktori kategori jika belum ada
      const categoryDir = join(uploadDir, category);
      await mkdir(categoryDir, { recursive: true });

      // Simpan file ke direktori sesuai kategori
      const filePath = join(categoryDir, file.name);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // Simpan metadata ke file JSON
      const metadataFilePath = join(jsonDir, `${file.name}.json`);
      await mkdir(jsonDir, { recursive: true });
      await writeFile(metadataFilePath, JSON.stringify(metadata));

      return NextResponse.json({
        message: 'File uploaded successfully',
        fileName: file.name,
        ...metadata,
      });
    }

    // Menangani kategori selain "umum"
    const metadata: Metadata = {
      name,
      semester,
      dosen,
      category,
      originalFileName: file.name,
      fileSize: file.size,
      uploadTime: new Date().toISOString(),
    };

    // Buat direktori kategori jika belum ada
    const categoryDir = join(uploadDir, category);
    await mkdir(categoryDir, { recursive: true });

    // Simpan file ke direktori sesuai kategori
    const filePath = join(categoryDir, file.name);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Simpan metadata ke file JSON
    const metadataFilePath = join(jsonDir, `${file.name}.json`);
    await mkdir(jsonDir, { recursive: true });
    await writeFile(metadataFilePath, JSON.stringify(metadata));

    return NextResponse.json({
      message: 'File uploaded successfully',
      fileName: file.name,
      ...metadata,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Handle PUT request to update the file
export async function PUT(request: NextRequest) {
  const { fileName, ...updatedData } = await request.json();

  const oldFilePath = join(uploadDir, updatedData.category, fileName);
  const newFilePath = join(uploadDir, updatedData.category, updatedData.name); // Updated file name

  const metadataFilePath = join(jsonDir, `${fileName}.json`);
  const newMetadataFilePath = join(jsonDir, `${updatedData.name}.json`);

  try {
    // Rename the file in the directory
    await rename(oldFilePath, newFilePath);

    // Update the metadata file with the new name
    const metadata = { ...updatedData, originalFileName: updatedData.name }; // Include the new file name in metadata
    await writeFile(newMetadataFilePath, JSON.stringify(metadata));

    // Delete the old metadata file
    await fs.promises.unlink(metadataFilePath);

    return NextResponse.json({ message: 'File and metadata updated successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update file and metadata' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { file, category } = await request.json();
  
  if (!file || !category) {
    return NextResponse.json({ error: 'Missing file or category parameter' }, { status: 400 });
  }

  try {
    // Delete the file from the category directory
    const filePath = join(uploadDir, category, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Delete the file
    }

    // Delete the metadata from the JSON directory
    const metadataFilePath = join(jsonDir, `${file}.json`);
    if (fs.existsSync(metadataFilePath)) {
      fs.unlinkSync(metadataFilePath); // Delete the metadata
    }

    return NextResponse.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete the file' }, { status: 500 });
  }
}


export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category');
  if (!category) {
    return NextResponse.json({ error: 'Category is required' }, { status: 400 });
  }

  const categoryDir = join(uploadDir, category);

  try {
    const files = await readdir(categoryDir);

    const fileList: any[] = [];

    for (const file of files) {
      const filePath = join(categoryDir, file);
      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        const metadataFilePath = join(jsonDir, `${file}.json`);
        let metadata: Metadata = { name: '', category: '', originalFileName: '', fileSize: 0, uploadTime: '', dosen: '', semester: '' };

        try {
          const metadataFile = await readFile(metadataFilePath, 'utf-8');
          metadata = JSON.parse(metadataFile);
        } catch (err) {
          console.error('Error reading metadata for file', file);
        }

        fileList.push({
          name: file,
          size: stats.size,
          semester: metadata.semester || '-',
          dosen: metadata.dosen || '-',
          uploadTime: metadata.uploadTime || '-',
          path: `/api/downloadmateri?file=${encodeURIComponent(file)}&category=${encodeURIComponent(category)}`,
          penerbit: metadata.penerbit || '-', // Menambahkan penerbit jika ada
          tahunTerbit: metadata.tahunTerbit || '-', // Menambahkan tahun terbit jika ada
          deskripsi: metadata.deskripsi || '-', // Menambahkan deskripsi jika ada
        });
      }
    }

    return NextResponse.json(fileList);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to read files from directory' }, { status: 500 });
  }
}

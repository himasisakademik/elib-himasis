import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readdir, readFile } from 'fs/promises';
import { join } from 'path';
import fs from 'fs';

interface Metadata {
  name: string;
  semester: string;
  dosen: string;
  category: string;
  originalFileName: string;
  fileSize: number;
  uploadTime: string;
}

const uploadDir = join(process.cwd(), 'public/e-lib');
const jsonDir = join(process.cwd(), 'public/e-lib/json'); 

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

    if (!file || !name || !semester || !dosen || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const originalFileName = file.name;
    const fileExtension = originalFileName.split('.').pop();
    const filePath = join(uploadDir, category, originalFileName);

    const categoryDir = join(uploadDir, category);
    await mkdir(categoryDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const uploadTime = new Date().toISOString();

    const metadata: Metadata = {
      name,
      semester,
      dosen,
      category,
      originalFileName,
      fileSize: file.size,
      uploadTime,
    };

    const metadataFilePath = join(jsonDir, `${originalFileName}.json`);
    await writeFile(metadataFilePath, JSON.stringify(metadata));

    return NextResponse.json({
      message: 'File uploaded successfully',
      fileName: originalFileName,
      ...metadata,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
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
        let metadata: Metadata = { name: '', semester: '', dosen: '', category: '', originalFileName: '', fileSize: 0, uploadTime: '' };

        try {
          const metadataFile = await readFile(metadataFilePath, 'utf-8');
          metadata = JSON.parse(metadataFile);
        } catch (err) {
          console.error('Error reading metadata for file', file);
        }

        fileList.push({
          name: file,
          size: stats.size,
          semester: metadata.semester || 'N/A',
          dosen: metadata.dosen || 'N/A',
          uploadTime: metadata.uploadTime || 'N/A',
          path: filePath,
        });
      }
    }

    return NextResponse.json(fileList);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read files from directory' }, { status: 500 });
  }
}

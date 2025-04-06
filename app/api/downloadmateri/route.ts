import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import fs from 'fs/promises';

const uploadDir = join(process.cwd(), 'uploads/e-lib');

export async function GET(request: NextRequest) {
  const fileName = request.nextUrl.searchParams.get('materi');
  const category = request.nextUrl.searchParams.get('category');

  if (!fileName || !category) {
    return NextResponse.json({ error: 'File name and category are required' }, { status: 400 });
  }

  const filePath = join(uploadDir, category, fileName);
  const metadataFilePath = join(uploadDir, 'json', `${fileName}.json`);

  try {
    await fs.access(filePath);
    const fileBuffer = await fs.readFile(filePath);
    const metadata = await fs.readFile(metadataFilePath, 'utf-8');

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Type': 'application/octet-stream',
        'Metadata': metadata, // Menambahkan metadata file
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'File not found or unreadable' }, { status: 404 });
  }
}

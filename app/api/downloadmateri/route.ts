import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import fs from 'fs/promises';

const uploadDir = join(process.cwd(), 'uploads/e-lib');

export async function GET(request: NextRequest) {
  const fileName = request.nextUrl.searchParams.get('file');
  const category = request.nextUrl.searchParams.get('category');

  if (!fileName || !category) {
    return NextResponse.json({ error: 'File name and category are required' }, { status: 400 });
  }

  const filePath = join(uploadDir, category, fileName);

  try {
    // Cek apakah file ada
    await fs.access(filePath);

    // Baca file sebagai buffer
    const fileBuffer = await fs.readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Type': 'application/octet-stream',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'File not found or unreadable' }, { status: 404 });
  }
}

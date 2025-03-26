import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import fs from 'fs';

const uploadDir = join(process.cwd(), 'uploads/e-lib');

export async function GET(request: NextRequest) {
  const fileName = request.nextUrl.searchParams.get('file');
  const category = request.nextUrl.searchParams.get('category');

  if (!fileName || !category) {
    return NextResponse.json({ error: 'File and category are required' }, { status: 400 });
  }

  const filePath = join(uploadDir, category, fileName);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Type': 'application/octet-stream',
    },
  });
}

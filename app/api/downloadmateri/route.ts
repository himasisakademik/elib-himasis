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
  const metadataFilePath = join(uploadDir, 'json', `${fileName}.json`);

  try {
  await fs.access(filePath);
  const fileBuffer = await fs.readFile(filePath);
  const metadataString = await fs.readFile(metadataFilePath, "utf-8");
  const encodedMetadata = Buffer.from(metadataString).toString("base64");

  return new NextResponse(fileBuffer as any, {
    headers: {
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Type": "application/octet-stream",
      "X-Metadata": encodedMetadata,
    },
  });

} catch (error) {
  console.error("Download error:", error);
  return NextResponse.json({ error: "File not found or unreadable" }, { status: 404 });
}
}
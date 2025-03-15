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
export const config = {
  api: {
    bodyParser: false,  
  },
};

// Handle file upload
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
    const fileExtension = originalFileName.split('.').pop(); // Get file extension
    const filePath = join(uploadDir, category, originalFileName); // Save file in category folder

    const categoryDir = join(uploadDir, category);
    await mkdir(categoryDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const uploadTime = new Date().toISOString(); 

    const metadata = {
      name,
      semester,
      dosen,
      category,
      originalFileName,
      fileSize: file.size,
      uploadTime, // Store the formatted upload time
    };

    // Save metadata as a JSON file alongside the uploaded file
    await writeFile(`${filePath}.json`, JSON.stringify(metadata));

    return NextResponse.json({
      message: 'File uploaded successfully',
      fileName: originalFileName,
      ...metadata,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// List files in the category
export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category'); // Correct way to access query params
  if (!category) {
    return NextResponse.json({ error: 'Category is required' }, { status: 400 });
  }

  const categoryDir = join(process.cwd(), 'public/e-lib', category);

  try {
    // Read the files in the category directory
    const files = await readdir(categoryDir);
    
    const fileList: any[] = [];
    
    for (const file of files) {
      const filePath = join(categoryDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile()) {
        // Read metadata file for each file (it should be a .json file)
        const metadataPath = `${filePath}.json`;
        let metadata: any = {};
        
        try {
          const metadataFile = await readFile(metadataPath, 'utf-8');
          metadata = JSON.parse(metadataFile);
        } catch (err) {
          console.error('Error reading metadata for file', file);
        }
        
        // Combine the file details with the metadata
        fileList.push({
          name: file,
          size: stats.size,
          semester: metadata.semester || 'N/A',  // Default to 'N/A' if no semester is found
          dosen: metadata.dosen || 'N/A',  // Default to 'N/A' if no dosen is found
          uploadTime: metadata.uploadTime || 'N/A', // Include uploadTime from metadata
          path: filePath,
        });
      }
    }

    return NextResponse.json(fileList);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read files from directory' }, { status: 500 });
  }
}
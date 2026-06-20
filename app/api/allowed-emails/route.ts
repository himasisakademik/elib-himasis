import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { auth } from '@/auth';
import { SUPER_ADMIN_EMAIL } from '@/lib/admin-config';

const emailsFilePath = path.join(process.cwd(), 'allowed-emails.json');

async function getAllowedEmails(): Promise<string[]> {
  try {
    const data = await fs.readFile(emailsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeAllowedEmails(emails: string[]): Promise<void> {
  await fs.writeFile(emailsFilePath, JSON.stringify(emails, null, 2));
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const allowedEmails = await getAllowedEmails();
  return NextResponse.json(allowedEmails);
}

export async function POST(request: Request) {
  const session = await auth();
  if (session?.user?.email !== SUPER_ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { email } = await request.json();
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Invalid email provided' }, { status: 400 });
  }

  const emails = await getAllowedEmails();
  if (emails.includes(email)) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
  }

  emails.push(email);
  await writeAllowedEmails(emails);

  return NextResponse.json({ success: true, message: 'Email added successfully' });
}

export async function DELETE(request: Request) {
    const session = await auth();
    if (session?.user?.email !== SUPER_ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  
    const { email } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email provided' }, { status: 400 });
    }
  
    let emails = await getAllowedEmails();
    const initialLength = emails.length;
    emails = emails.filter(e => e !== email);
  
    if (emails.length === initialLength) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }
  
    await writeAllowedEmails(emails);
  
    return NextResponse.json({ success: true, message: 'Email deleted successfully' });
}

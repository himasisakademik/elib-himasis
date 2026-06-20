import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getAllowedEmails, normalizeEmail, writeAllowedEmails } from '@/lib/allowed-emails';
import { SUPER_ADMIN_EMAIL } from '@/lib/admin-config';

export const dynamic = 'force-dynamic';

function jsonServerError(error: unknown) {
  console.error('Allowed emails API error:', error);
  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'Internal server error' },
    { status: 500 }
  );
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const allowedEmails = await getAllowedEmails();
    return NextResponse.json(allowedEmails);
  } catch (error) {
    return jsonServerError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (session?.user?.email !== SUPER_ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { email } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email provided' }, { status: 400 });
    }

    const normalizedEmail = normalizeEmail(email);
    const emails = await getAllowedEmails();
    if (emails.includes(normalizedEmail)) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const allowedEmails = await writeAllowedEmails([...emails, normalizedEmail]);

    return NextResponse.json({
      success: true,
      message: 'Email added successfully',
      allowedEmails,
    });
  } catch (error) {
    return jsonServerError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (session?.user?.email !== SUPER_ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  
    const { email } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid email provided' }, { status: 400 });
    }

    const normalizedEmail = normalizeEmail(email);
    let emails = await getAllowedEmails();
    const initialLength = emails.length;
    emails = emails.filter(e => e !== normalizedEmail);

    if (emails.length === initialLength) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    const allowedEmails = await writeAllowedEmails(emails);

    return NextResponse.json({
      success: true,
      message: 'Email deleted successfully',
      allowedEmails,
    });
  } catch (error) {
    return jsonServerError(error);
  }
}

import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_IDS = (process.env.TELEGRAM_CHAT_IDS || "").split(",").filter(Boolean);
const TELEGRAM_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, nim, angkatan, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nama, email, dan pesan wajib diisi" },
        { status: 400 }
      );
    }

    const text = `
🌟 *Saran / Kritik E-Library-Himasis* 📬

👤 **Name:** ${name}
📧 **Email:** ${email}
📱 **Phone:** ${phone}
🆔 **NIM:** ${nim}
🎓 **Angkatan:** ${angkatan}
💬 **Message:** ${message}

---
_Sent via E-Library Contact Form_
`;

    const promises = CHAT_IDS.map((chatId) =>
      fetch(TELEGRAM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId.trim(),
          text,
          parse_mode: "Markdown",
        }),
      })
    );

    await Promise.allSettled(promises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

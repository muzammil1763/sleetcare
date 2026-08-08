import { NextRequest, NextResponse } from "next/server";
import { createTransport } from "nodemailer";

export async function GET(req: NextRequest) {
  try {
    const transporter = createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.verify();

    await transporter.sendMail({
      from: `"Sleet Care" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: "Sleet Care — Email Test",
      html: "<p>Email is working correctly.</p>",
    });

    return NextResponse.json({ success: true, message: "Test email sent to " + process.env.SMTP_USER });
  } catch (e: any) {
    console.error("Email test error:", e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

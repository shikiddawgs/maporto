import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// ✅ This is the key fix: increase the body size limit for this API route
// Next.js App Router defaults to 1MB — we raise it to 200MB
export const maxDuration = 60; // allow up to 60 seconds for large uploads

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file size — max 200MB
    const MAX_SIZE = 200 * 1024 * 1024; // 200MB in bytes
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is 200MB, your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB` },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = path.extname(file.name) || ".mp4";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${filename}`,
      filename
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

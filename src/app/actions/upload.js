"use server";

import fs from "fs/promises";
import path from "path";

// Upload to Cloudinary for production (files persist on CDN)
async function uploadToCloudinary(buffer, filename) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary env variables not set");
  }

  // Determine resource type from extension
  const ext = path.extname(filename).toLowerCase();
  const videoExts = [".mp4", ".webm", ".mov", ".avi", ".mkv"];
  const resourceType = videoExts.includes(ext) ? "video" : "image";

  // Create form data for Cloudinary upload
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "portfolio";

  // Generate signature
  const crypto = await import("crypto");
  const signatureStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const signature = crypto.createHash("sha1").update(signatureStr).digest("hex");

  const formData = new FormData();
  const blob = new Blob([buffer]);
  formData.append("file", blob, filename);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Cloudinary upload error:", errText);
    throw new Error("Cloudinary upload failed");
  }

  const data = await res.json();
  return data.secure_url;
}

// Upload to local filesystem (for localhost dev)
async function uploadToLocal(buffer, filename) {
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, buffer);
  return `/uploads/${filename}`;
}

export async function uploadFile(formData) {
  try {
    const file = formData.get("file");

    if (!file) {
      return { error: "No file provided" };
    }

    // Check file size — max 200MB
    const MAX_SIZE = 200 * 1024 * 1024; // 200MB in bytes
    if (file.size > MAX_SIZE) {
      return {
        error: `File too large. Maximum size is 200MB, your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB`,
      };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = path.extname(file.name) || ".mp4";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

    let url;

    // Use Cloudinary if configured (production), else local filesystem (dev)
    const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;

    if (hasCloudinary) {
      try {
        url = await uploadToCloudinary(buffer, filename);
      } catch (cloudErr) {
        console.error("Cloudinary failed, falling back to local:", cloudErr);
        url = await uploadToLocal(buffer, filename);
      }
    } else {
      url = await uploadToLocal(buffer, filename);
    }

    return {
      success: true,
      url,
      filename,
    };
  } catch (err) {
    console.error("Upload error:", err);
    return { error: "Upload failed: " + err.message };
  }
}

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "socials.json");

function readSocials() {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeSocials(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// GET — return all social links
export async function GET() {
  return NextResponse.json(readSocials());
}

// PUT — update a social link's href
export async function PUT(req) {
  const { id, href } = await req.json();
  const socials = readSocials();
  const idx = socials.findIndex((s) => s.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  socials[idx].href = href;
  writeSocials(socials);
  return NextResponse.json({ success: true });
}

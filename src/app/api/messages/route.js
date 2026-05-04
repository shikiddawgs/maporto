import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "messages.json");

async function ensureDataFile() {
  try {
    await fs.access(dataFilePath);
  } catch {
    await fs.writeFile(dataFilePath, JSON.stringify([], null, 2));
  }
}

async function readMessages() {
  await ensureDataFile();
  const fileContent = await fs.readFile(dataFilePath, "utf8");
  return JSON.parse(fileContent);
}

async function writeMessages(data) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const messages = await readMessages();
  return NextResponse.json(messages);
}

export async function POST(request) {
  const body = await request.json();
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const messages = await readMessages();

  const newMsg = {
    id: Date.now().toString(),
    name,
    email,
    message,
    read: false,
    createdAt: new Date().toISOString()
  };

  messages.unshift(newMsg);
  await writeMessages(messages);

  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const messages = await readMessages();
  const filtered = messages.filter(m => m.id !== id);
  await writeMessages(filtered);

  return NextResponse.json({ success: true });
}

export async function PUT(request) {
  const body = await request.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const messages = await readMessages();
  const index = messages.findIndex(m => m.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  messages[index].read = true;
  await writeMessages(messages);

  return NextResponse.json(messages[index]);
}

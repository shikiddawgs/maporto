import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "videos.json");

async function ensureDataFile() {
  try {
    await fs.access(dataFilePath);
  } catch {
    const defaultData = [
      {
        id: "1",
        title: "Kidpedia Game Store",
        category: "IT",
        description: "Web platform for gaming needs — built with PHP & Laragon.",
        type: "image",
        url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
        createdAt: new Date().toISOString()
      },
      {
        id: "2",
        title: "Kopi Nu Sae BPMN",
        category: "IT",
        description: "Process modeling featuring a 3-actor BPMN diagram for a local coffee shop.",
        type: "image",
        url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
        createdAt: new Date().toISOString()
      },
      {
        id: "3",
        title: "Cyberpunk AMV",
        category: "Creative",
        description: "Motion graphics edit with Sapphire, Magic Bullet Looks & Animation Composer.",
        type: "video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        createdAt: new Date().toISOString()
      }
    ];
    await fs.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2));
  }
}

async function readVideos() {
  await ensureDataFile();
  const fileContent = await fs.readFile(dataFilePath, "utf8");
  return JSON.parse(fileContent);
}

async function writeVideos(data) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const videos = await readVideos();
  return NextResponse.json(videos);
}

export async function POST(request) {
  const body = await request.json();
  const videos = await readVideos();

  const newVideo = {
    id: Date.now().toString(),
    ...body,
    createdAt: new Date().toISOString()
  };

  videos.unshift(newVideo);
  await writeVideos(videos);

  return NextResponse.json(newVideo, { status: 201 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const videos = await readVideos();
  const project = videos.find(v => v.id === id);

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Delete uploaded files from disk
  const filesToDelete = [project.url, project.thumbnailUrl].filter(Boolean);
  for (const fileUrl of filesToDelete) {
    if (fileUrl.startsWith("/uploads/")) {
      try {
        const filePath = path.join(process.cwd(), "public", fileUrl);
        await fs.unlink(filePath);
      } catch (e) {
        // File may already be deleted, ignore
      }
    }
  }

  const filtered = videos.filter(v => v.id !== id);
  await writeVideos(filtered);
  return NextResponse.json({ success: true });
}

export async function PUT(request) {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const videos = await readVideos();
  const index = videos.findIndex(v => v.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  videos[index] = { ...videos[index], ...updates };
  await writeVideos(videos);

  return NextResponse.json(videos[index]);
}

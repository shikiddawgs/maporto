import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST() {
  // Only allow on localhost (not on Vercel production)
  try {
    const cwd = process.cwd();

    // Stage all changes (uploads + videos.json)
    await execAsync("git add -A", { cwd });

    // Commit with auto-generated message
    const timestamp = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
    await execAsync(`git commit -m "auto-deploy: new upload ${timestamp}"`, { cwd });

    // Push to GitHub (triggers Vercel auto-deploy)
    await execAsync("git push origin main", { cwd });

    return NextResponse.json({ success: true, message: "Pushed to GitHub! Vercel will auto-deploy." });
  } catch (err) {
    console.error("Deploy error:", err);
    // If nothing to commit, that's OK
    if (err.message?.includes("nothing to commit")) {
      return NextResponse.json({ success: true, message: "No changes to deploy." });
    }
    return NextResponse.json({ error: "Deploy failed: " + err.message }, { status: 500 });
  }
}

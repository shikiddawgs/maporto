import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

// Find files larger than 100MB in public/uploads and add them to .gitignore
async function excludeLargeFiles(cwd) {
  const uploadsDir = path.join(cwd, "public", "uploads");
  try {
    const files = await fs.readdir(uploadsDir);
    const largeFiles = [];

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const stat = await fs.stat(filePath);
      const sizeMB = stat.size / (1024 * 1024);
      if (sizeMB > 95) { // 95MB threshold (safe margin under GitHub's 100MB limit)
        largeFiles.push(`public/uploads/${file}`);
      }
    }

    if (largeFiles.length > 0) {
      // Read current .gitignore
      const gitignorePath = path.join(cwd, ".gitignore");
      let gitignore = await fs.readFile(gitignorePath, "utf8");

      for (const largeFile of largeFiles) {
        if (!gitignore.includes(largeFile)) {
          gitignore += `\n# Auto-excluded: file too large for GitHub (>95MB)\n${largeFile}\n`;
        }
      }

      await fs.writeFile(gitignorePath, gitignore);
      console.log("Excluded large files from git:", largeFiles);
    }

    return largeFiles;
  } catch {
    return [];
  }
}

export async function POST() {
  try {
    const cwd = process.cwd();

    // Auto-exclude files > 95MB from git
    const excluded = await excludeLargeFiles(cwd);

    // Stage all changes (uploads + videos.json + .gitignore)
    await execAsync("git add -A", { cwd });

    // If there are large files that were previously staged, unstage them
    for (const file of excluded) {
      try {
        await execAsync(`git reset HEAD "${file}"`, { cwd });
      } catch {
        // File might not be staged, that's OK
      }
    }

    // Commit with auto-generated message
    const timestamp = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
    try {
      await execAsync(`git commit -m "auto-deploy: new upload ${timestamp}"`, { cwd });
    } catch (commitErr) {
      if (commitErr.message?.includes("nothing to commit")) {
        return NextResponse.json({ success: true, message: "No changes to deploy." });
      }
      throw commitErr;
    }

    // Push to GitHub (triggers Vercel auto-deploy)
    await execAsync("git push origin main", { cwd });

    return NextResponse.json({
      success: true,
      message: "Pushed to GitHub! Vercel will auto-deploy.",
      excludedLargeFiles: excluded
    });
  } catch (err) {
    console.error("Deploy error:", err);
    return NextResponse.json({ error: "Deploy failed: " + (err.stderr || err.message) }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  const { password } = await request.json();

  if (password === "kido1205") {
    (await cookies()).set("admin_auth", "true", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 // 1 day
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, message: "Invalid password" }, { status: 401 });
}

export async function DELETE() {
  (await cookies()).delete("admin_auth");
  return NextResponse.json({ success: true });
}

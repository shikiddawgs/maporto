import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const isAuth = (await cookies()).has("admin_auth");
  return NextResponse.json({ authenticated: isAuth });
}

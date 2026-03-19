import { NextResponse } from "next/server";
import {
  CMS_SESSION_COOKIE_NAME,
  CMS_SESSION_TTL_SECONDS,
  createCmsSessionToken,
  hasValidCmsSession,
  isCmsConfigured,
  isCmsPasswordValid,
} from "../../../../lib/adminAuth";

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CMS_SESSION_TTL_SECONDS,
  };
}

export async function GET(request) {
  if (!isCmsConfigured()) {
    return NextResponse.json(
      { authenticated: false, error: "CMS_ADMIN_PASSWORD nao configurada no servidor." },
      { status: 500 }
    );
  }

  return NextResponse.json({ authenticated: hasValidCmsSession(request) });
}

export async function POST(request) {
  if (!isCmsConfigured()) {
    return NextResponse.json(
      { error: "CMS_ADMIN_PASSWORD nao configurada no servidor." },
      { status: 500 }
    );
  }

  const body = await request.json();
  const adminPassword = body?.adminPassword;
  if (!isCmsPasswordValid(adminPassword)) {
    return NextResponse.json({ error: "Senha do painel invalida." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(CMS_SESSION_COOKIE_NAME, createCmsSessionToken(), getCookieOptions());
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(CMS_SESSION_COOKIE_NAME, "", { ...getCookieOptions(), maxAge: 0 });
  return response;
}
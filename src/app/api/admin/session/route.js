import { NextResponse } from "next/server";
import {
  CMS_SESSION_COOKIE_NAME,
  CMS_SESSION_REMEMBER_TTL_SECONDS,
  CMS_SESSION_TTL_SECONDS,
  createCmsSessionToken,
  hasValidCmsSession,
  isCmsConfigured,
  isCmsPasswordValid,
} from "../../../../lib/adminAuth";

function getCookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
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
  const rememberDevice = Boolean(body?.rememberDevice);
  if (!isCmsPasswordValid(adminPassword)) {
    return NextResponse.json({ error: "Senha do painel invalida." }, { status: 401 });
  }

  const ttlSeconds = rememberDevice ? CMS_SESSION_REMEMBER_TTL_SECONDS : CMS_SESSION_TTL_SECONDS;
  const response = NextResponse.json({ success: true });
  response.cookies.set(CMS_SESSION_COOKIE_NAME, createCmsSessionToken(ttlSeconds), getCookieOptions(ttlSeconds));
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(CMS_SESSION_COOKIE_NAME, "", { ...getCookieOptions(CMS_SESSION_TTL_SECONDS), maxAge: 0 });
  return response;
}
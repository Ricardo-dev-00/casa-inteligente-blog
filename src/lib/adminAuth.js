import { createHmac, timingSafeEqual } from "node:crypto";

export const CMS_SESSION_COOKIE_NAME = "cms_session";
export const CMS_SESSION_TTL_SECONDS = 60 * 60 * 12;

function sign(value, secret) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function getCmsAdminPassword() {
  return process.env.CMS_ADMIN_PASSWORD || "";
}

export function isCmsConfigured() {
  return Boolean(getCmsAdminPassword());
}

export function isCmsPasswordValid(password) {
  const adminPassword = getCmsAdminPassword();
  if (!adminPassword) return false;
  return password === adminPassword;
}

export function createCmsSessionToken() {
  const adminPassword = getCmsAdminPassword();
  if (!adminPassword) return "";

  const exp = Math.floor(Date.now() / 1000) + CMS_SESSION_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
  const signature = sign(payload, adminPassword);
  return `${payload}.${signature}`;
}

export function verifyCmsSessionToken(token) {
  const adminPassword = getCmsAdminPassword();
  if (!adminPassword || !token || !token.includes(".")) return false;

  const [payload, providedSignature] = token.split(".");
  if (!payload || !providedSignature) return false;

  const expectedSignature = sign(payload, adminPassword);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (providedBuffer.length !== expectedBuffer.length) return false;
  if (!timingSafeEqual(providedBuffer, expectedBuffer)) return false;

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return Number(decoded?.exp) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function hasValidCmsSession(request) {
  const token = request.cookies?.get(CMS_SESSION_COOKIE_NAME)?.value;
  return verifyCmsSessionToken(token);
}

export function getCmsAuthResult(request, providedPassword) {
  if (!isCmsConfigured()) {
    return { ok: false, status: 500, error: "CMS_ADMIN_PASSWORD nao configurada no servidor." };
  }

  if (isCmsPasswordValid(providedPassword) || hasValidCmsSession(request)) {
    return { ok: true };
  }

  return { ok: false, status: 401, error: "Senha do painel invalida." };
}
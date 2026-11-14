// 웹 화면 PIN 잠금 (Vercel Routing Middleware).
// - /api/* 는 matcher 에서 빠져 있어 절대 막지 않는다 (앱·크론·루프가 쿠키 없이 부름).
// - PIN 값은 Vercel env APP_PIN 에서만 읽는다. 없으면(로컬 개발) 잠그지 않는다.
// - 맞게 넣으면 httpOnly 쿠키로 1년 기억. 쿠키에는 PIN 이 아니라 PIN 의 해시를 넣는다.

export const config = {
  matcher: [
    "/((?!api/|favicon\\.svg|icon\\.svg|icons\\.svg|icon-192\\.png|icon-512\\.png|apple-touch-icon\\.png|manifest\\.json).*)",
  ],
};

const COOKIE = "jp_pin";
const LOGIN_PATH = "/__pin";

async function tokenFor(pin) {
  const data = new TextEncoder().encode(`learn-japanese-pin:${pin}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function readCookie(req, name) {
  const raw = req.headers.get("cookie") || "";
  for (const part of raw.split(/;\s*/)) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i) === name) return part.slice(i + 1);
  }
  return null;
}

function loginPage(wrong) {
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>PIN</title>
<style>
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f6f3ec;font-family:-apple-system,system-ui,sans-serif;color:#1c2a44}
form{background:#fff;padding:32px 28px;border-radius:16px;box-shadow:0 6px 24px rgba(0,0,0,.08);width:min(320px,calc(100vw - 32px));box-sizing:border-box;text-align:center}
h1{font-size:20px;margin:0 0 16px}
input{width:100%;box-sizing:border-box;font-size:28px;letter-spacing:10px;text-align:center;padding:12px;border:1px solid #ccd;border-radius:10px}
button{margin-top:16px;width:100%;padding:12px;font-size:16px;border:0;border-radius:10px;background:#1f3a68;color:#fff}
.err{color:#c0392b;font-size:14px;margin:0 0 12px}
@media (prefers-color-scheme:dark){body{background:#111827;color:#e5e7eb}form{background:#1f2937}input{background:#111827;color:#e5e7eb;border-color:#374151}}
</style></head><body>
<form method="POST" action="${LOGIN_PATH}">
<h1>🔒 PIN 입력</h1>
${wrong ? '<p class="err">PIN 이 틀렸어요. 다시 입력해 주세요.</p>' : ""}
<input name="pin" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="current-password" autofocus required>
<button type="submit">들어가기</button>
</form></body></html>`;
  return new Response(html, {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

export default async function middleware(req) {
  const pin = process.env.APP_PIN;
  if (!pin) return; // 잠금 꺼짐

  const url = new URL(req.url);
  const expected = await tokenFor(pin);

  if (url.pathname === LOGIN_PATH && req.method === "POST") {
    const form = await req.formData().catch(() => null);
    const given = String(form?.get("pin") ?? "").trim();
    if (given !== pin) return loginPage(true);
    return new Response(null, {
      status: 303,
      headers: {
        location: "/",
        "set-cookie": `${COOKIE}=${expected}; Path=/; Max-Age=31536000; HttpOnly; Secure; SameSite=Lax`,
        "cache-control": "no-store",
      },
    });
  }

  if (readCookie(req, COOKIE) === expected) return; // 통과

  return loginPage(false);
}

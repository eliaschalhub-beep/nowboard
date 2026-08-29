// Secret-bookmark gate for Nowboard.
// ?k=<key> sets a one-year cookie; a key form is the fallback.
//
// The key itself is never stored here — only its SHA-256 digest, which cannot be
// reversed. That keeps the gate working without an environment variable and stays
// safe even if this file is committed to a public repo.

const KEY_SHA256 =
  "eec6c7380c7f3d6ff6d4c40684a175851ec1bb4ce2242cf02ea67f23570f6662";
const COOKIE = "nb_auth";
const YEAR = 60 * 60 * 24 * 365;

async function sha256(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Constant-time-ish compare on fixed-length hex digests.
function same(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function form(msg = ""): Response {
  return new Response(
    `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Nowboard</title>
<style>
 body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fff;color:#111;
  font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif}
 form{width:min(340px,86vw);text-align:left}
 h1{font-size:30px;color:#fb923c;margin:0 0 6px;letter-spacing:-.02em}
 p{color:#6b7280;margin:0 0 20px;font-size:14px}
 input{width:100%;padding:11px 13px;border:1px solid #e7e5e4;border-radius:10px;font-size:15px}
 input:focus{outline:2px solid #fb923c;outline-offset:1px;border-color:transparent}
 button{margin-top:10px;width:100%;padding:11px;border:0;border-radius:10px;background:#111;
  color:#fff;font-size:15px;cursor:pointer}
 .err{color:#b91c1c;font-size:13px;margin-top:10px}
</style>
<form method="GET"><h1>Nowboard</h1><p>This board is private.</p>
<input type="password" name="k" autofocus placeholder="Key" aria-label="Key">
<button type="submit">Open</button>
${msg ? `<div class="err">${msg}</div>` : ""}</form>`,
    {
      status: 401,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    },
  );
}

export default async (request: Request, context: any) => {
  const url = new URL(request.url);

  // Already carrying a valid cookie.
  const cookies = request.headers.get("cookie") ?? "";
  for (const c of cookies.split(";")) {
    const [name, ...rest] = c.trim().split("=");
    if (name === COOKIE && same(await sha256(rest.join("=")), KEY_SHA256)) {
      return context.next();
    }
  }

  // Arriving with the key in the URL: set the cookie, then redirect to a clean URL
  // so the key does not linger in history or get copied out of the address bar.
  const supplied = url.searchParams.get("k");
  if (supplied !== null) {
    if (!same(await sha256(supplied), KEY_SHA256)) return form("That key is not right.");
    url.searchParams.delete("k");
    return new Response(null, {
      status: 302,
      headers: {
        location: url.pathname + (url.search || ""),
        "cache-control": "no-store",
        "set-cookie":
          `${COOKIE}=${supplied}; Path=/; Max-Age=${YEAR}; HttpOnly; Secure; SameSite=Lax`,
      },
    });
  }

  return form();
};

export const config = { path: "/*" };

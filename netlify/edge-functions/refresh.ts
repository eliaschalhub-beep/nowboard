// On-demand Nowboard refresh. The gate runs first on /*.
// POST /refresh starts the GitHub workflow that writes git and deploys.

function page(status: number, body: string): Response {
  return new Response(
    `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Nowboard</title>
<style>
 body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fff;color:#111;
  font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif}
 .box{width:min(340px,86vw)}
 h1{font-size:30px;color:#fb923c;margin:0 0 6px;letter-spacing:-.02em}
 p{color:#6b7280;margin:0 0 20px;font-size:14px}
 a{color:#111}
</style>
<div class="box"><h1>Nowboard</h1><p>${body}</p>
<p><a href="/">Back to the board</a></p></div>`,
    {
      status,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    },
  );
}

export default async (request: Request) => {
  if (request.method !== "POST") {
    return page(405, "Use the Refresh button on the board.");
  }

  const token = Netlify.env.get("NOWBOARD_GITHUB_TOKEN") ?? Deno.env.get("NOWBOARD_GITHUB_TOKEN") ?? "";
  if (!token) {
    return page(503, "Refresh is not configured.");
  }

  const res = await fetch(
    "https://api.github.com/repos/eliaschalhub-beep/nowboard/actions/workflows/nowboard-run.yml/dispatches",
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        accept: "application/vnd.github+json",
        "x-github-api-version": "2022-11-28",
      },
      body: JSON.stringify({ ref: "main" }),
    },
  );

  if (res.status === 204 || res.ok) {
    return page(200, "Refresh started. The board will update in a minute.");
  }
  return page(502, "Refresh did not start.");
};

export const config = { path: "/refresh" };

import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

for (const [pathname, language, title] of [
  ["/", "en", "AI Adoption Playbook"],
  ["/fr", "fr", "Playbook d’adoption de l’IA"],
]) {
  test(`server-renders the ${language} playbook`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

    const html = await response.text();
    assert.match(html, new RegExp(title, "i"));
    assert.match(html, /Evidence before autonomy|La preuve avant l’autonomie/i);
    assert.match(html, /og\.png/i);
    assert.match(html, /href=["']#paths["']/i);
    assert.doesNotMatch(html, /react-loading-skeleton|Your site is taking shape/i);
  });
}

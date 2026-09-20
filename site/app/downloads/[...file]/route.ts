import { readFile } from "node:fs/promises";
import path from "node:path";
import { documents, downloads } from "../../document-manifest.mjs";

// Development/server parity. The static export copies these same approved bytes.
export async function GET(_request: Request, { params }: { params: Promise<{ file: string[] }> }) {
  const source = (await params).file.join("/");
  if (!documents.some((doc) => doc.source === source) && !downloads.includes(source)) return new Response("Not found", { status: 404 });
  const root = path.resolve(process.cwd(), path.basename(process.cwd()) === "site" ? ".." : ".");
  const content = await readFile(path.join(root, source));
  return new Response(content, { headers: { "content-type": source.endsWith(".md") ? "text/markdown; charset=utf-8" : source.endsWith(".csv") ? "text/csv; charset=utf-8" : "application/json", "content-disposition": `attachment; filename="${path.basename(source)}"`, "x-content-type-options": "nosniff" } });
}

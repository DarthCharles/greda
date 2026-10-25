import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";

const root = resolve("storybook-static");
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname
    );
    const path = resolve(
      root,
      `.${pathname === "/" ? "/index.html" : pathname}`
    );
    if (!path.startsWith(root + sep)) {
      response.writeHead(403).end();
      return;
    }
    const body = await readFile(path);
    response
      .writeHead(200, {
        "Content-Type": types[extname(path)] ?? "application/octet-stream",
      })
      .end(body);
  } catch {
    response.writeHead(404).end();
  }
}).listen(6007, "127.0.0.1");

import type { IncomingMessage, ServerResponse } from "node:http";
import { server } from "../backend/src/server";

// O servidor Node original continua sendo o roteador principal. Ao executá-lo
// no Vercel, não há listen(), nem seeds/importações disparados por requisição.
export default function handler(
  request: IncomingMessage,
  response: ServerResponse
): void {
  const url = new URL(request.url || "/", "https://cortex.invalid");
  const pathOriginal = url.searchParams.get("__cortex_path");
  if (pathOriginal !== null) {
    url.searchParams.delete("__cortex_path");
    const safePath = pathOriginal.startsWith("/") ? pathOriginal : "/" + pathOriginal;
    request.url = safePath + url.search;
  }
  server.emit("request", request, response);
}

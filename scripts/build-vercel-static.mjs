import { cp, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "frontend");
const target = path.join(root, "public");

// Mantém todas as páginas HTML no handler autenticado. Nunca publicar HTML
// diretamente no CDN, o que contornaria a proteção de sessão do Córtex.
await mkdir(target, { recursive: true });
await cp(source, target, {
  recursive: true,
  force: true,
  filter(file) {
    const relative = path.relative(source, file);
    if (relative.startsWith("..")) return false;
    return !/\.html?$/i.test(relative);
  }
});
console.log("[vercel] Recursos públicos sincronizados; HTML continua protegido pelo backend.");

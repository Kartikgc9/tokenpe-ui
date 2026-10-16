// Copies the static site into dist/ so only the public files are deployed
// (reference prompts in 21stcomps/ and local recordings stay out of the build).
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");
const entries = ["index.html", "404.html", "css", "js", "assets"];

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const entry of entries) {
  const from = join(root, entry);
  if (!existsSync(from)) {
    console.error(`build: missing ${entry}`);
    process.exit(1);
  }
  cpSync(from, join(out, entry), { recursive: true });
}

console.log(`build: copied ${entries.join(", ")} to dist/`);

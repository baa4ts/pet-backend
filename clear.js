import { readFileSync, writeFileSync } from "fs";
import { readdir, stat } from "fs/promises";
import { join, extname } from "path";

const EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".css", ".html", ".json", ".md"];

const ACCENT_MAP = {
  á: "a", é: "e", í: "i", ó: "o", ú: "u", ü: "u",
  Á: "A", É: "E", Í: "I", Ó: "O", Ú: "U", Ü: "U",
};

function removeTildes(text) {
  return text.replace(/[áéíóúüÁÉÍÓÚÜ]/g, (char) => ACCENT_MAP[char] ?? char);
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile() && EXTENSIONS.includes(extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  const srcDir = join(process.cwd(), "src");
  try { await stat(srcDir); } catch {
    console.error(`❌  No se encontró la carpeta: ${srcDir}`);
    process.exit(1);
  }

  const allFiles = await walk(srcDir);
  let changed = 0, skipped = 0;

  for (const file of allFiles) {
    const original = readFileSync(file, "utf8");
    const modified = removeTildes(original);
    if (modified !== original) {
      writeFileSync(file, modified, "utf8");
      console.log(`✅  Modificado: ${file}`);
      changed++;
    } else {
      skipped++;
    }
  }

  console.log(`\n📊  Resumen:`);
  console.log(`   Modificados : ${changed}`);
  console.log(`   Sin cambios : ${skipped}`);
  console.log(`   Total       : ${allFiles.length}`);
}

main();
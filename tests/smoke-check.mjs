import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const requiredPages = [
  "index.html", "menu.html", "reservation.html", "restaurant.html",
  "cafe-bakery.html", "events.html", "about.html", "contact.html", "admin.html"
];
const htmlFiles = readdirSync(root).filter(name => /\.html?$/.test(name));

for (const page of requiredPages) {
  assert.ok(existsSync(resolve(root, page)), "Missing required page: " + page);
}
for (const page of htmlFiles) {
  const html = readFileSync(resolve(root, page), "utf8");
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  assert.deepEqual(duplicates, [], page + " contains duplicate IDs");
  for (const match of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)=["']([^"']+)["'][^>]*>/gi)) {
    const asset = match[1];
    if (/^(?:https?:|data:|#|\/\/|mailto:|tel:)/i.test(asset)) continue;
    const clean = asset.split(/[?#]/, 1)[0];
    assert.ok(existsSync(resolve(root, dirname(page), clean)), page + " references missing asset: " + asset);
  }
}
for (const file of ["script.js", "admin.js", "cart.js", "talom-pages.js", "menu-runtime-v2.js"]) {
  assert.ok(existsSync(resolve(root, file)), "Missing runtime file: " + file);
}
for (const file of readdirSync(root).filter(name => name.endsWith(".js"))) {
  const source = readFileSync(resolve(root, file), "utf8");
  assert.doesNotMatch(source, /service_role|sb_secret_/, file + " must not expose privileged Supabase keys");
}
const router = readFileSync(resolve(root, "talom-pages.js"), "utf8");
assert.ok(router.includes('replace(/^\\/TALOM(?=\\/|$)/,"")'), "Page router must support GitHub Pages project prefix");
assert.ok(router.includes('replace(/\\.html$/,"")'), "Page router must support static .html page URLs");
assert.ok(existsSync(resolve(root, "github-pages-compat.js")), "GitHub Pages compatibility runtime is missing");
const compatibility = readFileSync(resolve(root, "github-pages-compat.js"), "utf8");
assert.ok(compatibility.includes('const base="/TALOM/"'), "GitHub Pages base path is incorrect");
assert.ok(compatibility.includes('path+=".html"'), "Friendly page links must resolve to static HTML files");
console.log("TALOM repository smoke checks passed.");

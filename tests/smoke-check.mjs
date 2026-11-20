import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const requiredPages = [
  "index.html", "menu.html", "reservation.html", "restaurant.html",
  "cafe-bakery.html", "events.html", "about.html", "contact.html", "admin.html"
];
for (const page of requiredPages) {
  assert.ok(existsSync(resolve(root, page)), "Missing required page: " + page);
}
for (const page of readdirSync(root).filter(name => /\.html?$/.test(name))) {
  const html = readFileSync(resolve(root, page), "utf8");
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  assert.deepEqual(duplicates, [], page + " contains duplicate IDs");
}
for (const file of ["script.js", "admin.js", "cart.js", "talom-pages.js", "menu-runtime-v2.js", "github-pages-compat.js"]) {
  assert.ok(existsSync(resolve(root, file)), "Missing runtime file: " + file);
}
const router = readFileSync(resolve(root, "talom-pages.js"), "utf8");
assert.ok(router.includes("/TALOM"), "Page router must support the GitHub Pages project path");
assert.ok(router.includes(".html"), "Page router must support static HTML page URLs");
console.log("TALOM repository smoke checks passed.");

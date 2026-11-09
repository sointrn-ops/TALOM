import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = process.cwd();
const pages = ["index.html", "indexl.htm", "admin.html"];

for (const page of pages) {
  const html = readFileSync(resolve(root, page), "utf8");
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual([...new Set(duplicates)], [], page + " contains duplicate IDs");

  for (const match of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)=["']([^"']+)["'][^>]*>/gi)) {
    const asset = match[1];
    if (/^(?:https?:|data:|#)/i.test(asset)) continue;
    const clean = asset.split(/[?#]/, 1)[0];
    assert.ok(existsSync(resolve(root, dirname(page), clean)), page + " references missing asset: " + asset);
  }
}

const publicJs = readFileSync(resolve(root, "script.js"), "utf8");
const adminJs = readFileSync(resolve(root, "admin.js"), "utf8");
const publicHtml = readFileSync(resolve(root, "index.html"), "utf8");
const publicCss = readFileSync(resolve(root, "style.css"), "utf8");
const adminHtml = readFileSync(resolve(root, "admin.html"), "utf8");

assert.ok(publicJs.includes("select=id,name,name_en,category,description,description_en,price,image_url"), "Public product query must load English descriptions");
assert.ok(publicJs.includes("descEn: row.description_en || row.description || \"\""), "Public product cards must use the stored English description");
assert.match(publicJs, /auth\.resetPasswordForEmail\(/, "Customer password recovery request is missing");
assert.match(publicJs, /auth\.updateUser\(\{ password \}\)/, "Customer password update is missing");
assert.match(publicJs, /PASSWORD_RECOVERY/, "Password recovery callback is missing");
assert.match(publicJs, /authMode = mode === "signup" \\|\\| mode === "recovery" \\? mode : "signin";/, "Password recovery mode must remain distinct from sign-in mode");
assert.match(publicJs, /const focusable = \$\$\(/, "Modal focus trap must query all focusable controls");
assert.match(publicHtml, /id=["']authForgotPassword["']/, "Password recovery control is missing");
assert.match(publicHtml, /id=["']authModeSwitch["']/, "Authentication mode switch container is missing");
assert.match(publicCss, /--font\s*:/, "Public CSS font variable is missing");
assert.match(publicCss, /\.auth-forgot[^{]*\{[^}]*var\(--font\)/s, "Password recovery control must use the declared font variable");
assert.ok(publicJs.includes('const tabs = $$("[data-auth-mode]");'), "Auth mode tabs must query all mode buttons");
assert.ok(publicJs.includes('$$("[data-auth-mode]").forEach(button => {'), "Auth mode event binding must query all mode buttons");
assert.match(adminJs, /profile\.role !== ["']admin["']/, "Admin role check is missing");
assert.ok(adminHtml.includes('id="product-description-en"'), "Admin product form must expose English descriptions");
assert.ok(adminJs.includes('description_en: productDescriptionEn.value.trim() || null'), "Admin product save must persist English descriptions");
assert.ok(adminJs.includes('productDescriptionEn.value = product.description_en || ""'), "Admin product edit must load English descriptions");
assert.match(adminHtml, /name=["']robots["'][^>]*noindex/i, "Admin page should not be indexed");
assert.ok(adminHtml.includes('supabase-js@2.119.0'), 'Admin Supabase SDK must use the same pinned version as the public site');
assert.ok(publicHtml.includes('supabase-js@2.119.0'), 'Public Supabase SDK version must remain pinned');

for (const source of [publicJs, adminJs]) {
  assert.match(source, /sb_publishable_/, "A Supabase publishable key should be used");
  assert.doesNotMatch(source, /service_role|sb_secret_/, "A privileged Supabase key must never be shipped to the browser");
}

const productDescriptionMigrationPath = resolve(root, "supabase/migrations/20261109180105_add_english_product_descriptions.sql");
assert.ok(existsSync(productDescriptionMigrationPath), "The English product description schema migration must be committed");
const productDescriptionMigration = readFileSync(productDescriptionMigrationPath, "utf8");
assert.ok(productDescriptionMigration.toLowerCase().includes("alter table public.products"), "The English description migration must target public.products");
assert.ok(productDescriptionMigration.toLowerCase().includes("add column if not exists description_en text"), "The English description migration must add a nullable text column safely");

console.log("TALOM static smoke checks passed.");

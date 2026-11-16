"use strict";

const SUPABASE_URL = "https://rlecvkrrdxqjepsxylee.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable__TOW24x67zjRnlas6Lb0xg_1wF0tC1g";

const menuGrid = document.getElementById("menuGrid");
const menuStatus = document.getElementById("menuStatus");
const searchInput = document.getElementById("menuSearch");
const menuFilters = [...document.querySelectorAll(".filter-button")];
let menuProducts = [];
let activeFilter = "all";
let searchTerm = "";

const categoryLabels = {
  coffee: "قهوه",
  cold: "نوشیدنی سرد",
  special: "ویژه",
  dessert: "شیرینی و دسر",
  food: "غذا"
};

function escapeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function fallbackImage(category) {
  const images = {
    coffee: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    cold: "https://images.unsplash.com/photo-1513558161293-c?auto=format&fit=crop&w=900&q=80",
    dessert: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",
    food: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
    special: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80"
  };
  return images[category] || images.coffee;
}

function formatPrice(value) {
  const price = Number(value);
  if (!Number.isFinite(price) || price <= 0) return "قیمت در مجموعه";
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

function renderMenu() {
  if (!menuGrid) return;
  const normalized = searchTerm.trim().toLocaleLowerCase("fa");
  const visible = menuProducts.filter(item => {
    const categoryMatch = activeFilter === "all" || item.category === activeFilter;
    const text = (item.name + " " + item.description + " " + (categoryLabels[item.category] || "")).toLocaleLowerCase("fa");
    return categoryMatch && (!normalized || text.includes(normalized));
  });

  menuGrid.replaceChildren();
  if (!visible.length) {
    const empty = document.createElement("div");
    empty.className = "menu-empty";
    empty.textContent = menuProducts.length
      ? "موردی با این جست‌وجو پیدا نشد."
      : "منوی محصولات هنوز در سامانه ثبت نشده است.";
    menuGrid.appendChild(empty);
    return;
  }

  visible.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "menu-card";
    card.style.animationDelay = Math.min(index * 45, 300) + "ms";

    const imageWrap = document.createElement("div");
    imageWrap.className = "menu-card-image";
    const image = document.createElement("img");
    image.src = item.image || fallbackImage(item.category);
    image.alt = item.name;
    image.loading = "lazy";
    image.onerror = () => { image.src = fallbackImage(item.category); };
    imageWrap.appendChild(image);

    const info = document.createElement("div");
    info.className = "menu-card-info";
    const category = document.createElement("span");
    category.className = "menu-card-category";
    category.textContent = categoryLabels[item.category] || "WOON MENU";
    const name = document.createElement("h3");
    name.className = "menu-card-title";
    name.textContent = item.name;
    const description = document.createElement("p");
    description.className = "menu-card-description";
    description.textContent = item.description || "با دقت و مواد اولیهٔ تازه آماده می‌شود.";
    const bottom = document.createElement("div");
    bottom.className = "menu-card-bottom";
    const price = document.createElement("span");
    price.textContent = formatPrice(item.price);
    const number = document.createElement("span");
    number.textContent = String(index + 1).padStart(2, "0");
    bottom.append(price, number);
    info.append(category, name, description, bottom);
    card.append(imageWrap, info);
    menuGrid.appendChild(card);
  });
}

async function loadMenu() {
  if (!menuGrid) return;
  try {
    const response = await fetch(
      SUPABASE_URL + "/rest/v1/products?select=id,name,category,description,price,image_url&is_available=eq.true&order=id.asc",
      { headers: { apikey: SUPABASE_PUBLIC_KEY, Authorization: "Bearer " + SUPABASE_PUBLIC_KEY } }
    );
    if (!response.ok) throw new Error("Menu request failed: " + response.status);
    const rows = await response.json();
    menuProducts = rows.map(row => ({
      id: String(row.id),
      name: row.name || "محصول وون",
      category: row.category || "coffee",
      description: row.description || "",
      price: row.price,
      image: String(row.image_url || "").trim()
    }));
    menuStatus.textContent = menuProducts.length ? "منوی به‌روز وون" : "برای نمایش محصولات، آن‌ها را از پنل مدیریت ثبت کنید.";
    renderMenu();
  } catch (error) {
    console.error("WOON menu load error:", error);
    menuProducts = [];
    menuStatus.textContent = "اتصال منو برقرار نشد؛ دسترسی عمومی جدول محصولات را بررسی کنید.";
    renderMenu();
  }
}

menuFilters.forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "all";
    menuFilters.forEach(item => item.classList.toggle("active", item === button));
    renderMenu();
  });
});

searchInput?.addEventListener("input", event => {
  searchTerm = event.target.value || "";
  renderMenu();
});

const header = document.getElementById("siteHeader");
function updateHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 24);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const menuOverlay = document.getElementById("siteMenu");
const menuTrigger = document.getElementById("menuTrigger");
const menuClose = document.getElementById("menuClose");

function setMenu(open) {
  menuOverlay?.classList.toggle("open", open);
  menuOverlay?.setAttribute("aria-hidden", String(!open));
  menuTrigger?.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
}
menuTrigger?.addEventListener("click", () => setMenu(true));
menuClose?.addEventListener("click", () => setMenu(false));
menuOverlay?.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", () => setMenu(false));
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    setMenu(false);
    closeLightbox();
  }
});

document.querySelectorAll(".offering-row").forEach(link => {
  link.addEventListener("click", () => {
    const category = link.dataset.category;
    if (!category) return;
    activeFilter = category;
    menuFilters.forEach(button => button.classList.toggle("active", button.dataset.filter === category));
  });
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

function closeLightbox() {
  lightbox?.classList.remove("open");
  lightbox?.setAttribute("aria-hidden", "true");
  if (lightboxImage) lightboxImage.removeAttribute("src");
}
document.querySelectorAll(".gallery-item").forEach(button => {
  button.addEventListener("click", () => {
    const source = button.dataset.image;
    if (!source || !lightbox || !lightboxImage) return;
    lightboxImage.src = source;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});
lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

loadMenu();

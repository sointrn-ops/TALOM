
"use strict";

const SUPABASE_URL = "https://rlecvkrrdxqjepsxylee.supabase.co";
const SUPABASE_KEY = "sb_publishable__TOW24x67zjRnlas6Lb0xg_1wF0tC1g";

let products = [];
let productsLoadFailed = false;

const categoryNames = {
  all: { fa: "همه", en: "All" },
  coffee: { fa: "قهوه گرم", en: "Hot Coffee" },
  cold: { fa: "نوشیدنی سرد", en: "Cold Drinks" },
  special: { fa: "خاص TALOM", en: "Signatures" },
  dessert: { fa: "دسر", en: "Desserts" },
  food: { fa: "غذا", en: "Food" }
};

const state = {
  language: "fa",
  category: "all",
  search: "",
  selectedProduct: null,
  favorites: new Set()
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const grid = $("#productGrid");
const searchInput = $("#menuSearch");
const clearSearch = $("#clearSearch");
const emptyState = $("#emptyState");
const productCount = $("#productCount");
const productModal = $("#productModal");
const imageModal = $("#imageModal");
const toastElement = $("#toast");

let toastTimer;
let activeModal = null;
let previousFocus = null;

// دریافت محصولات از Supabase
async function loadProducts() {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=id,name,name_en,category,description,price,image_url&is_available=eq.true&order=id.asc`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Supabase error: ${response.status}`);
  }

  const rows = await response.json();
  productsLoadFailed = false;

  products = rows.map(row => ({
    id: Number(row.id),
    category: row.category,
    name: row.name || "",
    en: row.name_en || row.name || "",
    price: Number(row.price) || 0,
    description: row.description || "",
    descEn: row.description_en || row.description || "",
    image: row.image_url || ""
  }));

  // حذف علاقه‌مندی‌هایی که دیگر در دیتابیس وجود ندارند
  state.favorites = new Set(
    [...state.favorites].filter(id =>
      products.some(product => product.id === id)
    )
  );

  try {
    localStorage.setItem(
      "talom-favorites",
      JSON.stringify([...state.favorites])
    );
  } catch (error) {
    // Product loading must not fail when browser storage is unavailable.
    console.warn("Could not persist favorites:", error);
  }
}

function isEnglish() {
  return state.language === "en";
}

function formatPrice(price) {
  if (isEnglish()) {
    return `${new Intl.NumberFormat("en-US").format(price)} T`;
  }
  return `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
}

function getProductName(product) {
  return isEnglish() ? product.en : product.name;
}

function getProductDescription(product) {
  return isEnglish() ? product.descEn : product.description;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function renderProducts() {
  if (!grid) return;

  const query = state.search.trim().toLocaleLowerCase();

  const filtered = products.filter(product => {
    const matchesCategory =
      state.category === "all" || product.category === state.category;

    const searchable = [
      product.name,
      product.en,
      product.description,
      product.descEn
    ].join(" ").toLocaleLowerCase();

    return matchesCategory && (!query || searchable.includes(query));
  });

  grid.innerHTML = filtered.map((product, index) => {
    const favorite = state.favorites.has(product.id);
    const categoryLabel =
      categoryNames[product.category]?.[state.language] || "";

    return `
      <article class="product-card" style="animation-delay:${Math.min(index * 45, 360)}ms">
        <div class="product-image-wrap">
          <img
            class="product-image"
            src="${escapeHTML(product.image)}"
            alt="${escapeHTML(getProductName(product))}"
            loading="lazy"
            data-product-image="${product.id}"
          >
          <span class="product-number">${String(product.id).padStart(2, "0")}</span>
          <button
            class="favorite-button ${favorite ? "is-favorite" : ""}"
            data-favorite="${product.id}"
            aria-label="${isEnglish() ? "Toggle favorite" : "افزودن به علاقه‌مندی‌ها"}"
            aria-pressed="${favorite}"
          >${favorite ? "♥" : "♡"}</button>
        </div>
        <div class="product-info">
          <span class="product-category">${escapeHTML(categoryLabel)}</span>
          <h3 class="product-name">${escapeHTML(getProductName(product))}</h3>
          <p class="product-description">${escapeHTML(getProductDescription(product))}</p>
          <div class="product-bottom">
            <strong class="product-price">${formatPrice(product.price)}</strong>
            <button class="product-details" data-details="${product.id}">
              ${isEnglish() ? "Details ↗" : "جزئیات ↗"}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  if (productCount) {
    productCount.textContent = isEnglish()
      ? `${filtered.length} selections`
      : `${new Intl.NumberFormat("fa-IR").format(filtered.length)} انتخاب`;
  }

  if (emptyState) {
    emptyState.hidden = filtered.length !== 0;
    const message = $("p", emptyState);
    if (message && productsLoadFailed) {
      message.textContent = isEnglish()
        ? "The menu could not be loaded. Please try again later."
        : "بارگذاری منو ناموفق بود. لطفاً بعداً دوباره تلاش کنید.";
    }
  }
  if (grid) grid.hidden = filtered.length === 0;
}

function showToast(message) {
  if (!toastElement) return;

  toastElement.textContent = message;
  toastElement.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toastElement.classList.remove("show");
  }, 2400);
}

function updateFavoriteButton(button, productId) {
  if (!button) return;

  const favorite = state.favorites.has(productId);

  button.classList.toggle("is-favorite", favorite);
  button.textContent = favorite ? "♥" : "♡";
  button.setAttribute("aria-pressed", String(favorite));
}

function toggleFavorite(productId, button) {
  if (state.favorites.has(productId)) {
    state.favorites.delete(productId);
    showToast(isEnglish() ? "Removed from favorites" : "از علاقه‌مندی‌ها حذف شد");
  } else {
    state.favorites.add(productId);
    showToast(isEnglish() ? "Added to favorites" : "به علاقه‌مندی‌ها اضافه شد");
  }

  try {
    localStorage.setItem(
      "talom-favorites",
      JSON.stringify([...state.favorites])
    );
  } catch {}

  if (button) updateFavoriteButton(button, productId);

  if (state.selectedProduct === productId) {
    const modalFavorite = $("#modalFavorite");
    if (modalFavorite) updateFavoriteButton(modalFavorite, productId);
  }
}

function openModal(modal) {
  if (!modal) return;

  previousFocus = document.activeElement;
  activeModal = modal;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  const closeButton = $(".modal-close", modal);
  if (closeButton) closeButton.focus();
}

function closeModal(modal = activeModal) {
  if (!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");

  if (activeModal === modal) activeModal = null;
  if (!activeModal) document.body.style.overflow = "";

  if (previousFocus && typeof previousFocus.focus === "function") {
    previousFocus.focus();
  }
}

function openProduct(productId) {
  const product = products.find(item => item.id === productId);

  if (!product || !productModal) return;

  state.selectedProduct = product.id;

  const modalImage = $("#modalProductImage");
  modalImage.onerror = () => {
    modalImage.onerror = null;
    modalImage.removeAttribute("src");
    modalImage.alt = isEnglish() ? "Image unavailable" : "تصویر در دسترس نیست";
    modalImage.classList.add("image-unavailable");
  };
  modalImage.classList.remove("image-unavailable");
  if (product.image) {
    modalImage.src = product.image;
  } else {
    modalImage.removeAttribute("src");
    modalImage.classList.add("image-unavailable");
  }
  modalImage.alt = getProductName(product);
  $("#modalProductName").textContent = getProductName(product);
  $("#modalProductDescription").textContent = getProductDescription(product);
  $("#modalProductCategory").textContent =
    categoryNames[product.category]?.[state.language] || "";
  $("#modalProductPrice").textContent = formatPrice(product.price);

  const favoriteButton = $("#modalFavorite");
  updateFavoriteButton(favoriteButton, product.id);

  openModal(productModal);
}

function openGalleryImage(imageUrl, alt = "TALOM") {
  if (!imageModal || !imageUrl) return;

  $("#expandedImage").src = imageUrl;
  $("#expandedImage").alt = alt;

  openModal(imageModal);
}

function setLanguage(language) {
  state.language = language;

  const english = language === "en";

  document.documentElement.lang = english ? "en" : "fa";
  document.documentElement.dir = english ? "ltr" : "rtl";

  const languageButton = $("#languageToggle");

  if (languageButton) {
    languageButton.textContent = english ? "FA" : "EN";
  }

  $$("[data-fa][data-en]").forEach(element => {
    const value = element.dataset[english ? "en" : "fa"];
    if (value !== undefined) element.innerHTML = value;
  });

  if (searchInput) {
    searchInput.placeholder =
      searchInput.dataset[english ? "placeholderEn" : "placeholderFa"] || "";

    searchInput.setAttribute("aria-label", searchInput.placeholder);
  }

  $$("#categoryTabs .category-tab").forEach(button => {
    const label = button.dataset[english ? "en" : "fa"];
    if (label) button.textContent = label;
  });

  if (activeModal === productModal && state.selectedProduct) {
    const product = products.find(
      item => item.id === state.selectedProduct
    );

    if (product) {
      $("#modalProductName").textContent = getProductName(product);
      $("#modalProductDescription").textContent =
        getProductDescription(product);

      $("#modalProductCategory").textContent =
        categoryNames[product.category]?.[language] || "";

      $("#modalProductPrice").textContent = formatPrice(product.price);
    }
  }

  renderProducts();

  try {
    localStorage.setItem("talom-language", language);
  } catch {}
}

function setTheme(theme) {
  const selectedTheme = theme === "light" ? "light" : "dark";

  document.documentElement.dataset.theme = selectedTheme;

  const icon = $("#themeIcon");

  if (icon) {
    icon.textContent = selectedTheme === "dark" ? "☼" : "☾";
  }

  try {
    localStorage.setItem("talom-theme", selectedTheme);
  } catch {}
}

function setupNavigation() {
  const header = $("#siteHeader");
  const nav = $("#mainNav");
  const menuToggle = $("#mobileMenuToggle");
  const backToTop = $("#backToTop");
  const scrollProgress = $("#scrollProgress");

  function updateScrollUI() {
    const scrollTop = window.scrollY;
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollable > 0
      ? (scrollTop / scrollable) * 100
      : 0;

    if (header) header.classList.toggle("scrolled", scrollTop > 30);
    if (backToTop) backToTop.classList.toggle("visible", scrollTop > 500);

    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }
  }

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });

    $$("a", nav).forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", event => {
      if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

function setupMenu() {
  const categoryTabs = $("#categoryTabs");

  if (categoryTabs) {
    categoryTabs.addEventListener("click", event => {
      const button = event.target.closest("[data-category]");
      if (!button) return;

      state.category = button.dataset.category;

      $$(".category-tab", categoryTabs).forEach(tab => {
        tab.classList.toggle("active", tab === button);
      });

      renderProducts();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      state.search = searchInput.value;

      if (clearSearch) {
        clearSearch.style.visibility = state.search ? "visible" : "hidden";
      }

      renderProducts();
    });
  }

  if (clearSearch) {
    clearSearch.addEventListener("click", () => {
      if (searchInput) {
        searchInput.value = "";
        state.search = "";
        searchInput.focus();
      }

      clearSearch.style.visibility = "hidden";
      renderProducts();
    });

    clearSearch.style.visibility = "hidden";
  }

  if (grid) {
    grid.addEventListener("click", event => {
      const favoriteButton = event.target.closest("[data-favorite]");

      if (favoriteButton) {
        toggleFavorite(
          Number(favoriteButton.dataset.favorite),
          favoriteButton
        );
        return;
      }

      const detailsButton = event.target.closest("[data-details]");

      if (detailsButton) {
        openProduct(Number(detailsButton.dataset.details));
      }
    });

    grid.addEventListener("error", event => {
      const image = event.target;

      if (
        !(image instanceof HTMLImageElement) ||
        !image.matches("[data-product-image]")
      ) return;

      if (!image.dataset.fallbackTried) {
        image.dataset.fallbackTried = "true";
        image.classList.remove("image-unavailable");
        image.src =
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80";
        return;
      }

      image.classList.add("image-unavailable");
      image.removeAttribute("src");
      image.alt = isEnglish() ? "Image unavailable" : "تصویر در دسترس نیست";
    }, true);
  }

  const modalFavorite = $("#modalFavorite");

  if (modalFavorite) {
    modalFavorite.addEventListener("click", () => {
      if (!state.selectedProduct) return;

      toggleFavorite(state.selectedProduct, modalFavorite);

      const cardButton = $(
        `[data-favorite="${state.selectedProduct}"]`
      );

      if (cardButton) {
        updateFavoriteButton(cardButton, state.selectedProduct);
      }
    });
  }
}

function setupModals() {
  document.addEventListener("click", event => {
    const closeButton = event.target.closest("[data-close-modal]");

    if (closeButton) {
      closeModal(closeButton.closest(".modal"));
      return;
    }

    const galleryCard = event.target.closest(".gallery-card");

    if (galleryCard) {
      const image = $("img", galleryCard);

      openGalleryImage(
        galleryCard.dataset.image,
        image?.alt || "TALOM gallery"
      );
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && activeModal) {
      closeModal(activeModal);
    }
  });
}

function setupMusic() {
  const audio = $("#siteMusic");
  const playButton = $("#musicToggle");
  const muteButton = $("#musicMute");
  const progress = $("#musicProgress");
  const currentTime = $("#musicCurrent");
  const duration = $("#musicDuration");
  const status = $("#musicStatus");

  if (!audio || !playButton) return;

  audio.volume = 0.35;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${remainder}`;
  }

  function updatePlayUI() {
    const playing = !audio.paused;

    playButton.innerHTML = playing
      ? "Ⅱ"
      : '<span class="music-play-icon">▶</span>';

    playButton.setAttribute(
      "aria-label",
      playing ? "Pause music" : "Play music"
    );

    const message = playing
      ? (isEnglish() ? "Now playing" : "در حال پخش")
      : (isEnglish() ? "Tap to play" : "برای پخش لمس کن");

    if (status) status.textContent = message;

    const art = $(".music-art");

    if (art) art.classList.toggle("music-playing", playing);
  }

  playButton.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        showToast(
          isEnglish()
            ? "Check that music/ali.mp3 exists and try again."
            : "وجود فایل music/ali.mp3 را بررسی کن و دوباره بزن."
        );
      }
    } else {
      audio.pause();
    }

    updatePlayUI();
  });

  audio.addEventListener("play", updatePlayUI);
  audio.addEventListener("pause", updatePlayUI);

  audio.addEventListener("loadedmetadata", () => {
    if (duration) {
      duration.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener("timeupdate", () => {
    if (currentTime) {
      currentTime.textContent = formatTime(audio.currentTime);
    }

    if (duration) {
      duration.textContent = formatTime(audio.duration);
    }

    if (
      progress &&
      Number.isFinite(audio.duration) &&
      audio.duration > 0
    ) {
      progress.value = String(
        (audio.currentTime / audio.duration) * 100
      );
    }
  });

  if (progress) {
    progress.addEventListener("input", () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime =
          (Number(progress.value) / 100) * audio.duration;
      }
    });
  }

  if (muteButton) {
    muteButton.addEventListener("click", () => {
      audio.muted = !audio.muted;

      muteButton.textContent = audio.muted ? "×" : "♫";

      muteButton.setAttribute(
        "aria-label",
        audio.muted ? "Unmute music" : "Mute music"
      );
    });
  }

  audio.addEventListener("error", () => {
    if (status) {
      status.textContent = isEnglish()
        ? "Audio file not found"
        : "فایل موسیقی پیدا نشد";
    }
  });

  updatePlayUI();
}

function setupRevealAnimations() {
  const revealElements = $$(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(element => {
      element.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(element => observer.observe(element));
}

function setupCounters() {
  const counters = $$(".stat-number");

  if (!("IntersectionObserver" in window)) {
    counters.forEach(counter => {
      counter.textContent = counter.dataset.target;
    });
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.target) || 0;
      const start = performance.now();
      const duration = 1200;

      function animate(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const value = Math.round(target * eased);

        counter.textContent = isEnglish()
          ? new Intl.NumberFormat("en-US").format(value)
          : new Intl.NumberFormat("fa-IR").format(value);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }

      requestAnimationFrame(animate);
      observer.unobserve(counter);
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function loadSavedSettings() {
  try {
    const savedTheme = localStorage.getItem("talom-theme");
    const savedLanguage = localStorage.getItem("talom-language");
    const savedFavorites = JSON.parse(
      localStorage.getItem("talom-favorites") || "[]"
    );

    if (savedTheme) setTheme(savedTheme);

    if (savedLanguage === "en" || savedLanguage === "fa") {
      state.language = savedLanguage;
    }

    if (Array.isArray(savedFavorites)) {
      state.favorites = new Set(savedFavorites.map(Number));
    }
  } catch {
    // The site still works if browser storage is unavailable.
  }
}

async function init() {
  loadSavedSettings();

  const languageButton = $("#languageToggle");
  const themeButton = $("#themeToggle");

  if (languageButton) {
    languageButton.addEventListener("click", () => {
      setLanguage(isEnglish() ? "fa" : "en");
    });
  }

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      setTheme(
        document.documentElement.dataset.theme === "dark"
          ? "light"
          : "dark"
      );
    });
  }

  const year = $("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  setupNavigation();
  setupMenu();
  setupModals();
  setupMusic();
  setupRevealAnimations();
  setupCounters();

  try {
    await loadProducts();
    setLanguage(state.language);
  } catch (error) {
    console.error("TALOM products loading error:", error);
    products = [];
    productsLoadFailed = true;
    renderProducts();
    if (grid) grid.hidden = true;
    if (emptyState) {
      emptyState.hidden = false;
      const message = $("p", emptyState);
      if (message) {
        message.textContent = isEnglish()
          ? "The menu could not be loaded. Please try again later."
          : "بارگذاری منو ناموفق بود. لطفاً بعداً دوباره تلاش کنید.";
      }
    }
    if (productCount) productCount.textContent = isEnglish() ? "Unavailable" : "در دسترس نیست";
    showToast(
      isEnglish()
        ? "Could not load products from the server."
        : "دریافت محصولات از سرور ناموفق بود."
    );
    setLanguage(state.language);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

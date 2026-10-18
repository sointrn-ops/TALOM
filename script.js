
"use strict";

const products = [
  {
    id: 1, category: "coffee", name: "کاپوچینو", en: "Cappuccino",
    price: 145000, description: "اسپرسو، شیر بخار داده‌شده و فوم لطیف.",
    descEn: "Espresso, steamed milk and silky foam.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7hRAb9nEZwieK6W76hGmnFjqTL8iN-NcbyTEYLxQ7gg&s=10"
  },
  {
    id: 2, category: "coffee", name: "کارامل لاته", en: "Caramel Latte",
    price: 165000, description: "لاته مخملی با شیرینی کارامل.",
    descEn: "Velvety latte with smooth caramel sweetness.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9CDiM61rH7x9jbmKvwr-obzoXeG_QU22aZWtob_YahQ&s=10"
  },
  {
    id: 3, category: "coffee", name: "موکا", en: "Mocha",
    price: 170000, description: "ترکیب قهوه، شکلات و شیر.",
    descEn: "A rich blend of espresso, chocolate and milk.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBg-8qXT-hRkUZGo2SfyYS6TNok1gtMsji7IFh_4yT3Q&s=10"
  },
  {
    id: 4, category: "cold", name: "آیس لاته", en: "Iced Latte",
    price: 155000, description: "اسپرسو و شیر خنک با یخ.",
    descEn: "Chilled milk, espresso and ice.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaKSURp0dDFoHpB2rrOByPYGnEk9hZrpioqkgXmyW5iw&s=10"
  },
  {
    id: 5, category: "cold", name: "کلد برو", en: "Cold Brew",
    price: 150000, description: "قهوه دم‌آوری سرد با طعمی عمیق.",
    descEn: "Slow-steeped coffee with a smooth finish.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6n9hWpDCa2CSU_HhpEPG6vSHHuU9-ek0450OzNfxrIg&s=10"
  },
  {
    id: 6, category: "cold", name: "آیس موکا", en: "Iced Mocha",
    price: 175000, description: "قهوه سرد با شکلات و شیر.",
    descEn: "Iced espresso blended with chocolate and milk.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv8EyAGZ5pF7USY5uqh29-EEAwtpbtzFaw1Qg2sbV-rg&s=10"
  },
  {
    id: 7, category: "special", name: "آیس اسپنیش لاته", en: "Iced Spanish Latte",
    price: 185000, description: "لاته سرد با شیر غلیظ و طعم خاص.",
    descEn: "A creamy iced latte with a sweet, rich finish.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV1s5QFmGdcTZx0mYWnq-dXGQZw0jSQLKPQv76WrY_Mw&s=10"
  },
  {
    id: 8, category: "special", name: "ماچا لاته", en: "Matcha Latte",
    price: 190000, description: "ماچا باکیفیت با شیر لطیف.",
    descEn: "Quality matcha whisked with creamy milk.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMojYmVAkz9IDPeWYQOI1eX00n7ouD36zTYZsVWAyipA&s=10"
  },
  {
    id: 9, category: "special", name: "شکلات داغ", en: "Hot Chocolate",
    price: 160000, description: "شکلات گرم، غلیظ و آرامش‌بخش.",
    descEn: "Rich, warming chocolate made for slow moments.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_fyUfmjK_AFoWiRUS7pfx1A58WwiGjrcOXEQdAq9EDw&s=10"
  },
  {
    id: 10, category: "cold", name: "میلک‌شیک توت‌فرنگی", en: "Strawberry Milkshake",
    price: 180000, description: "میلک‌شیک خنک با طعم توت‌فرنگی.",
    descEn: "A creamy milkshake with strawberry flavour.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF7fG5_Xhjfl4Vb3DQbfz1iZ3MC629vj3gFz9uLT5FBQ&s"
  },
  {
    id: 11, category: "cold", name: "لیموناد نعنا", en: "Mint Lemonade",
    price: 130000, description: "لیمو، نعنا و تازگی در یک لیوان.",
    descEn: "Fresh lemon and mint in a refreshing blend.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx5ENurDvGhyLmXkTBqMz07f-EuZXd2Hy8DlvOuWjYSA&s=10"
  },
  {
    id: 12, category: "dessert", name: "چیزکیک", en: "Cheesecake",
    price: 175000, description: "دسری لطیف با بافت خامه‌ای.",
    descEn: "A delicate dessert with a creamy texture.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8uYfwJpdqdtVQle2OJ9uv9UuqNwWFLSlPSHDOJ412RA&s=10"
  },
  {
    id: 13, category: "dessert", name: "تیرامیسو", en: "Tiramisu",
    price: 185000, description: "قهوه، خامه و لایه‌های لطیف.",
    descEn: "Coffee, cream and delicate layered textures.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP0F2Uw3SlYHrZzurJkc-i7VyV2CFdmv5ndxgzjP_J-Q&s=10"
  },
  {
    id: 14, category: "dessert", name: "کروسان کره‌ای", en: "Butter Croissant",
    price: 115000, description: "کروسان لایه‌ای با عطر کره.",
    descEn: "A flaky, buttery pastry with a golden crust.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZteOet3NatEauPQtamqOsPWGeUlyIbsKmJQ07osQz1Q&s=10"
  },
  {
    id: 15, category: "food", name: "پنینی مرغ", en: "Chicken Panini",
    price: 245000, description: "ساندویچ گرم با مرغ و ترکیبات تازه.",
    descEn: "A warm grilled sandwich with chicken and fresh ingredients.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7QoZqKK4FXAKqeiC5LSlmVT_0PVzgMsx4yWoGf7cRww&s=10"
  },
  {
    id: 16, category: "food", name: "ساندویچ پستو و پنیر", en: "Pesto Cheese Sandwich",
    price: 220000, description: "پستو معطر و پنیر در نان برشته.",
    descEn: "A toasted sandwich with fragrant pesto and cheese.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzLRT4-GLVY-20OCgSus9zOp8BWF9kn25-GRgTQ7mTLg&s=10"
  },
  {
    id: 17, category: "food", name: "سالاد سزار", en: "Caesar Salad",
    price: 230000, description: "سالاد تازه با سس سزار.",
    descEn: "Fresh greens with classic Caesar dressing.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZpauAqlRncCNfDwogjtZiyGopu5QMa9Q-R9SBwC7Fhg&s=10"
  },
  {
    id: 18, category: "food", name: "ساندویچ بوقلمون", en: "Turkey Sandwich",
    price: 240000, description: "ساندویچ سبک با بوقلمون و سبزیجات.",
    descEn: "A balanced sandwich with turkey and fresh vegetables.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLFrMlwjuxaH0syASyacQd3NpnpDu0Y6WsQ9NYXtl8tw&s=10"
  },
  {
    id: 19, category: "special", name: "پسته لاته", en: "Pistachio Latte",
    price: 195000, description: "لاته خامه‌ای با نت‌های پسته.",
    descEn: "A creamy latte with delicate pistachio notes.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU--L7IAJRZCGDQVwQ5dPk2gAmpo8UcAO36PvI8yn6tQ&s=10"
  },
  {
    id: 20, category: "special", name: "وانیلا کرم", en: "Vanilla Cream",
    price: 180000, description: "ترکیبی لطیف با عطر وانیل.",
    descEn: "A smooth creation with fragrant vanilla.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp8SuzYgmecpTQPSFXO_CFb-GXyJku1sZU9z8LAdsejw&s=10"
  },
  {
    id: 21, category: "special", name: "هانی گلد", en: "Honey Gold",
    price: 190000, description: "ترکیبی ویژه با شیرینی ملایم عسل.",
    descEn: "A signature drink with delicate honey sweetness.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2eeN_oLqfKsFzlwyfuke-37qgquHZkQRon8Ck78dIig&s"
  },
  {
    id: 22, category: "cold", name: "اورنج تونیک", en: "Orange Tonic",
    price: 165000, description: "ترکیب مرکباتی با تونیک خنک.",
    descEn: "A sparkling, citrus-forward orange tonic.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs-mTa5lTVY7p4VbBwC1f8i2xjsPDv44snDmI_BPWunQ&s=10"
  }
];

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
    const categoryLabel = categoryNames[product.category][state.language];

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

  if (emptyState) emptyState.hidden = filtered.length !== 0;
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
    localStorage.setItem("talom-favorites", JSON.stringify([...state.favorites]));
  } catch {
    // Favorites continue to work until the page is refreshed.
  }

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

  $("#modalProductImage").src = product.image;
  $("#modalProductImage").alt = getProductName(product);
  $("#modalProductName").textContent = getProductName(product);
  $("#modalProductDescription").textContent = getProductDescription(product);
  $("#modalProductCategory").textContent = categoryNames[product.category][state.language];
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
  if (languageButton) languageButton.textContent = english ? "FA" : "EN";

  $$("[data-fa][data-en]").forEach(element => {
    const value = element.dataset[english ? "en" : "fa"];
    if (value !== undefined) element.innerHTML = value;
  });

  if (searchInput) {
    searchInput.placeholder = searchInput.dataset[english ? "placeholderEn" : "placeholderFa"] || "";
    searchInput.setAttribute("aria-label", searchInput.placeholder);
  }

  $$("#categoryTabs .category-tab").forEach(button => {
    const label = button.dataset[english ? "en" : "fa"];
    if (label) button.textContent = label;
  });

  if (activeModal === productModal && state.selectedProduct) {
    const product = products.find(item => item.id === state.selectedProduct);
    if (product) {
      $("#modalProductName").textContent = getProductName(product);
      $("#modalProductDescription").textContent = getProductDescription(product);
      $("#modalProductCategory").textContent = categoryNames[product.category][language];
      $("#modalProductPrice").textContent = formatPrice(product.price);
    }
  }

  renderProducts();

  try {
    localStorage.setItem("talom-language", language);
  } catch {
    // Language works without storage.
  }
}

function setTheme(theme) {
  const selectedTheme = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = selectedTheme;
  const icon = $("#themeIcon");
  if (icon) icon.textContent = selectedTheme === "dark" ? "☼" : "☾";

  try {
    localStorage.setItem("talom-theme", selectedTheme);
  } catch {
    // Theme works without storage.
  }
}

function setupNavigation() {
  const header = $("#siteHeader");
  const nav = $("#mainNav");
  const menuToggle = $("#mobileMenuToggle");
  const backToTop = $("#backToTop");
  const scrollProgress = $("#scrollProgress");

  function updateScrollUI() {
    const scrollTop = window.scrollY;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;

    if (header) header.classList.toggle("scrolled", scrollTop > 30);
    if (backToTop) backToTop.classList.toggle("visible", scrollTop > 500);
    if (scrollProgress) scrollProgress.style.width = `${progress}%`;
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
      if (clearSearch) clearSearch.style.visibility = state.search ? "visible" : "hidden";
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
        toggleFavorite(Number(favoriteButton.dataset.favorite), favoriteButton);
        return;
      }

      const detailsButton = event.target.closest("[data-details]");
      if (detailsButton) {
        openProduct(Number(detailsButton.dataset.details));
      }
    });

    grid.addEventListener("error", event => {
      const image = event.target;
      if (!(image instanceof HTMLImageElement) || !image.matches("[data-product-image]")) return;

      if (!image.dataset.fallbackTried) {
        image.dataset.fallbackTried = "true";
        const product = products.find(item => item.id === Number(image.dataset.productImage));
        if (product) {
          image.src = `https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80`;
        }
      }
    }, true);
  }

  const modalFavorite = $("#modalFavorite");
  if (modalFavorite) {
    modalFavorite.addEventListener("click", () => {
      if (!state.selectedProduct) return;
      toggleFavorite(state.selectedProduct, modalFavorite);

      const cardButton = $(`[data-favorite="${state.selectedProduct}"]`);
      if (cardButton) updateFavoriteButton(cardButton, state.selectedProduct);
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
      openGalleryImage(galleryCard.dataset.image, image?.alt || "TALOM gallery");
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && activeModal) closeModal(activeModal);
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
    const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainder}`;
  }

  function updatePlayUI() {
    const playing = !audio.paused;
    playButton.innerHTML = playing ? "Ⅱ" : '<span class="music-play-icon">▶</span>';
    playButton.setAttribute("aria-label", playing ? "Pause music" : "Play music");

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
        showToast(isEnglish()
          ? "Check that music/ali.mp3 exists and try again."
          : "وجود فایل music/ali.mp3 را بررسی کن و دوباره بزن.");
      }
    } else {
      audio.pause();
    }
    updatePlayUI();
  });

  audio.addEventListener("play", updatePlayUI);
  audio.addEventListener("pause", updatePlayUI);

  audio.addEventListener("loadedmetadata", () => {
    if (duration) duration.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    if (currentTime) currentTime.textContent = formatTime(audio.currentTime);
    if (duration) duration.textContent = formatTime(audio.duration);

    if (progress && Number.isFinite(audio.duration) && audio.duration > 0) {
      progress.value = String((audio.currentTime / audio.duration) * 100);
    }
  });

  if (progress) {
    progress.addEventListener("input", () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = (Number(progress.value) / 100) * audio.duration;
      }
    });
  }

  if (muteButton) {
    muteButton.addEventListener("click", () => {
      audio.muted = !audio.muted;
      muteButton.textContent = audio.muted ? "×" : "♫";
      muteButton.setAttribute("aria-label", audio.muted ? "Unmute music" : "Mute music");
    });
  }

  audio.addEventListener("error", () => {
    if (status) {
      status.textContent = isEnglish() ? "Audio file not found" : "فایل موسیقی پیدا نشد";
    }
  });

  updatePlayUI();
}

function setupRevealAnimations() {
  const revealElements = $$(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(element => element.classList.add("is-visible"));
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
    counters.forEach(counter => counter.textContent = counter.dataset.target);
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

        if (progress < 1) requestAnimationFrame(animate);
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
    const savedFavorites = JSON.parse(localStorage.getItem("talom-favorites") || "[]");

    if (savedTheme) setTheme(savedTheme);
    if (savedLanguage === "en" || savedLanguage === "fa") {
      state.language = savedLanguage;
    }

    if (Array.isArray(savedFavorites)) {
      state.favorites = new Set(
        savedFavorites.map(Number).filter(id => products.some(product => product.id === id))
      );
    }
  } catch {
    // The site still works if browser storage is unavailable.
  }
}

function init() {
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
      setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    });
  }

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  setLanguage(state.language);
  setupNavigation();
  setupMenu();
  setupModals();
  setupMusic();
  setupRevealAnimations();
  setupCounters();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}

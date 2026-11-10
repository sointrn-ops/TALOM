
"use strict";

const SUPABASE_URL = "https://rlecvkrrdxqjepsxylee.supabase.co";
const SUPABASE_KEY = "sb_publishable__TOW24x67zjRnlas6Lb0xg_1wF0tC1g";

let authClient = null;
let authMode = "signin";
let authRecoveryActive = false;

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
    `${SUPABASE_URL}/rest/v1/products?select=id,name,name_en,category,description,description_en,price,image_url&is_available=eq.true&order=id.asc`,
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

  const usedProductImages = new Set();
  products = rows.map(row => {
    // Use verified product image URLs from the database only.
    // Repeated or missing URLs receive a labeled local placeholder rather than
    // an unrelated random photo that could misrepresent the product.
    const sourceImage = String(row.image_url || "").trim();
    const hasUniqueImage = Boolean(sourceImage && !usedProductImages.has(sourceImage));
    const image = hasUniqueImage
      ? sourceImage
      : productPlaceholder(row.name || row.name_en || "TALOM");
    if (hasUniqueImage) usedProductImages.add(sourceImage);

    return {
      id: String(row.id),
      category: row.category,
      name: row.name || "",
      en: row.name_en || row.name || "",
      price: Number(row.price) || 0,
      description: row.description || "",
      descEn: row.description_en || row.description || "",
      image
    };
  });

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

function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[٠-٩]/g, digit => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[۰-۹]/g, digit => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .toLocaleLowerCase()
    .trim();
}

function productPlaceholder(productName) {
  const label = escapeHTML(productName || (isEnglish() ? "TALOM" : "TALOM"));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900"><rect width="900" height="900" fill="#ded8c9"/><circle cx="450" cy="390" r="150" fill="#c6bda9"/><path d="M330 360h240v145a120 120 0 0 1-240 0z" fill="#74634e"/><path d="M570 390h55a55 55 0 0 1 0 110h-55" fill="none" stroke="#74634e" stroke-width="28"/><path d="M390 280c-35-45 35-55 0-100m95 100c-35-45 35-55 0-100" fill="none" stroke="#8a765c" stroke-width="13" stroke-linecap="round"/><text x="450" y="680" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" fill="#4d463b">${label}</text><text x="450" y="730" text-anchor="middle" font-family="Arial,sans-serif" font-size="19" letter-spacing="6" fill="#766d5f">TALOM COFFEE CULTURE</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
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

function productCardMarkup(product, index) {
  const favorite = state.favorites.has(product.id);
  const categoryLabel = categoryNames[product.category]?.[state.language] || "";
  return `
    <article class="product-card" style="animation-delay:${Math.min(index * 35, 280)}ms">
      <div class="product-image-wrap">
        <img class="product-image" src="${escapeHTML(product.image)}" alt="${escapeHTML(getProductName(product))}" loading="lazy" data-product-image="${product.id}">
        <span class="product-number">${String(index + 1).padStart(2, "0")}</span>
        <button class="favorite-button ${favorite ? "is-favorite" : ""}" data-favorite="${product.id}" aria-label="${isEnglish() ? "Toggle favorite" : "افزودن به علاقه‌مندی‌ها"}" aria-pressed="${favorite}">${favorite ? "♥" : "♡"}</button>
      </div>
      <div class="product-info">
        <span class="product-category">${escapeHTML(categoryLabel)}</span>
        <h3 class="product-name">${escapeHTML(getProductName(product))}</h3>
        <p class="product-description">${escapeHTML(getProductDescription(product))}</p>
        <div class="product-bottom"><strong class="product-price">${formatPrice(product.price)}</strong><button class="product-details" data-details="${product.id}">${isEnglish() ? "Details ↗" : "جزئیات ↗"}</button></div>
      <button class="cart-add-button" type="button" data-cart-add="${product.id}" data-cart-price="${product.price}">${isEnglish() ? "Add to bag +" : "افزودن به سبد خرید +"}</button>
      </div>
    </article>`;
}

// No third-party random image service is used for product photos.

function renderProducts() {
  if (!grid) return;
  const query = normalizeSearchText(state.search);
  const filtered = products.filter(product => {
    const matchesCategory = state.category === "all" || product.category === state.category;
    const searchable = normalizeSearchText([product.name, product.en, product.description, product.descEn].join(" "));
    return matchesCategory && (!query || searchable.includes(query));
  });

  const groups = [
    { key: "drinks", ids: ["productGrid"], categories: ["coffee", "cold", "special"], shelf: "drinksShelf", count: "drinksCount" },
    { key: "desserts", ids: ["dessertGrid"], categories: ["dessert"], shelf: "dessertsShelf", count: "dessertsCount" },
    { key: "food", ids: ["foodGrid"], categories: ["food"], shelf: "foodShelf", count: "foodCount" }
  ];

  groups.forEach(group => {
    const target = document.getElementById(group.ids[0]);
    const shelf = document.getElementById(group.shelf);
    const items = filtered.filter(product => group.categories.includes(product.category));
    if (target) {
      target.innerHTML = items.map((product, index) => productCardMarkup(product, index)).join("");
      target.hidden = items.length === 0;
      target.scrollTo({ left: 0, behavior: "auto" });
    }
    if (shelf) shelf.hidden = items.length === 0;
    const count = document.getElementById(group.count);
    if (count) count.textContent = isEnglish() ? String(items.length).padStart(2, "0") + " ITEMS" : new Intl.NumberFormat("fa-IR").format(items.length) + " مورد";
  });

  if (productCount) productCount.textContent = isEnglish()
    ? `${filtered.length} selections`
    : `${new Intl.NumberFormat("fa-IR").format(filtered.length)} انتخاب`;

  if (emptyState) {
    emptyState.hidden = filtered.length !== 0;
    const message = $("p", emptyState);
    if (message && productsLoadFailed) message.textContent = isEnglish()
      ? "The menu could not be loaded. Please try again later."
      : "بارگذاری منو ناموفق بود. لطفاً بعداً دوباره تلاش کنید.";
  }
  updateAllCarouselControls();
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

window.talomOpenModal = openModal;
window.talomCloseModal = closeModal;

function openProduct(productId) {
  const product = products.find(item => item.id === productId);

  if (!product || !productModal) return;

  state.selectedProduct = product.id;

  const modalImage = $("#modalProductImage");
  modalImage.onerror = () => {
    modalImage.onerror = null;
    modalImage.src = productPlaceholder(getProductName(product));
    modalImage.alt = getProductName(product);
    modalImage.classList.add("image-unavailable");
  };
  modalImage.classList.remove("image-unavailable");
  if (product.image) {
    modalImage.src = product.image;
  } else {
    modalImage.src = productPlaceholder(getProductName(product));
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
    localStorage.setItem("talom-theme-v2", selectedTheme);
  } catch {}
}


function setAuthMessage(message, type = "") {
  const element = $("#authMessage");
  if (!element) return;
  element.textContent = message;
  element.dataset.type = type;
}

function setAuthMode(mode) {
  authMode = mode === "signup" || mode === "recovery" ? mode : "signin";
  const confirmWrap = $("#authConfirmWrap");
  const confirmInput = $("#authPasswordConfirm");
  const passwordInput = $("#authPassword");
  const submit = $("#authSubmit");
  const modeSwitch = $("#authModeSwitch");
  const forgotButton = $("#authForgotPassword");
  const tabs = $$("[data-auth-mode]");
  const needsConfirmation = authMode === "signup" || authMode === "recovery";
  tabs.forEach(tab => tab.classList.toggle("active", tab.dataset.authMode === authMode));
  if (modeSwitch) modeSwitch.hidden = authMode === "recovery";
  if (forgotButton) forgotButton.hidden = authMode !== "signin";
  if (confirmWrap) confirmWrap.hidden = !needsConfirmation;
  if (confirmInput) confirmInput.required = needsConfirmation;
  if (passwordInput) passwordInput.autocomplete = needsConfirmation ? "new-password" : "current-password";
  if (submit) submit.textContent = isEnglish()
    ? (authMode === "signup" ? "Create account" : authMode === "recovery" ? "Update password" : "Sign in")
    : (authMode === "signup" ? "ساخت حساب کاربری" : authMode === "recovery" ? "تغییر رمز عبور" : "ورود به حساب");
  setAuthMessage("");
}

function renderAuthSession(session) {
  const user = session?.user || null;
  const signedOut = $("#authSignedOut");
  const signedIn = $("#authSignedIn");
  const openButton = $("#authOpenButton");
  const email = $("#authUserEmail");
  if (signedOut) signedOut.hidden = Boolean(user) && !authRecoveryActive;
  if (signedIn) signedIn.hidden = !user || authRecoveryActive;
  if (email) email.textContent = user?.email || "";
  if (openButton) {
    openButton.textContent = user
      ? (isEnglish() ? "My account" : "حساب من")
      : (isEnglish() ? "Sign in" : "ورود / ثبت‌نام");
    openButton.setAttribute("aria-label", openButton.textContent);
  }
  if (!user) setAuthMode(authMode);
}

function setupAuth() {
  const modal = $("#authModal");
  const openButton = $("#authOpenButton");
  const form = $("#authForm");
  const signOutButton = $("#authSignOut");
  if (!modal || !openButton || !form) return;

  if (!window.supabase?.createClient) {
    openButton.disabled = true;
    openButton.title = isEnglish() ? "Authentication library unavailable" : "کتابخانه ورود بارگذاری نشد";
    return;
  }

  authClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
  window.talomAuthClient = authClient;

  openButton.addEventListener("click", async () => {
    try {
      const { data, error } = await authClient.auth.getSession();
      if (error) throw error;
      renderAuthSession(data?.session || null);
    } catch (error) {
      console.error("TALOM session lookup error:", error);
      setAuthMessage(isEnglish() ? "Could not check your session. Please try again." : "بررسی وضعیت حساب انجام نشد؛ دوباره تلاش کن.", "error");
    }
    openModal(modal);
  });

  $$("[data-auth-mode]").forEach(button => {
    button.addEventListener("click", () => setAuthMode(button.dataset.authMode));
  });

  const forgotButton = $("#authForgotPassword");
  forgotButton?.addEventListener("click", async () => {
    const emailInput = $("#authEmail");
    const email = emailInput?.value.trim() || "";
    if (!email || !emailInput.reportValidity()) {
      emailInput?.focus();
      setAuthMessage(isEnglish() ? "Enter a valid email address first." : "ابتدا یک ایمیل معتبر وارد کن.", "error");
      return;
    }
    forgotButton.disabled = true;
    setAuthMessage(isEnglish() ? "Sending recovery email..." : "در حال ارسال ایمیل بازیابی...");
    try {
      const { error } = await authClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname
      });
      if (error) throw error;
      setAuthMessage(isEnglish()
        ? "If this address is registered, a password recovery link will arrive by email."
        : "اگر این ایمیل ثبت شده باشد، پیوند بازیابی رمز برایت ارسال می‌شود.", "success");
    } catch (error) {
      console.error("TALOM password recovery request error:", error);
      setAuthMessage(isEnglish() ? "Could not send the recovery email. Check your connection and try again." : "ارسال ایمیل بازیابی انجام نشد؛ اتصال را بررسی و دوباره تلاش کن.", "error");
    } finally {
      forgotButton.disabled = false;
    }
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!authClient) return;
    const email = $("#authEmail")?.value.trim();
    const password = $("#authPassword")?.value || "";
    const confirmPassword = $("#authPasswordConfirm")?.value || "";
    const submit = $("#authSubmit");
    if (!email || !password) return;
    if (password.length < 8) {
      setAuthMessage(isEnglish() ? "Use at least 8 characters for your password." : "رمز عبور باید حداقل ۸ نویسه داشته باشد.", "error");
      return;
    }
    if ((authMode === "signup" || authMode === "recovery") && password !== confirmPassword) {
      setAuthMessage(isEnglish() ? "Passwords do not match." : "رمزهای عبور یکسان نیستند.", "error");
      return;
    }
    if (submit) submit.disabled = true;
    setAuthMessage(isEnglish() ? "Please wait..." : "لطفاً صبر کن...");
    try {
      if (authMode === "recovery") {
        const { error } = await authClient.auth.updateUser({ password });
        if (error) throw error;
        authRecoveryActive = false;
        const { data } = await authClient.auth.getSession();
        renderAuthSession(data?.session || null);
        setAuthMode("signin");
        showToast(isEnglish() ? "Your password has been updated." : "رمز عبور با موفقیت تغییر کرد.");
      } else if (authMode === "signup") {
        const { data, error } = await authClient.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + window.location.pathname }
        });
        if (error) throw error;
        if (data.session) {
          renderAuthSession(data.session);
          setAuthMessage(isEnglish() ? "Your account has been created." : "حساب کاربری ساخته شد.", "success");
        } else {
          setAuthMessage(isEnglish()
            ? "Check your inbox and confirm your email to finish signing up."
            : "برای تکمیل ثبت‌نام، ایمیل خود را باز کن و نشانی تأیید را بزن.", "success");
        }
      } else {
        const { data, error } = await authClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        renderAuthSession(data.session);
        setAuthMessage(isEnglish() ? "Signed in successfully." : "با موفقیت وارد شدی.", "success");
      }
    } catch (error) {
      const message = error?.message || "";
      const translated = /invalid login credentials/i.test(message)
        ? (isEnglish() ? "Email or password is incorrect." : "ایمیل یا رمز عبور نادرست است.")
        : /already registered|user already registered/i.test(message)
          ? (isEnglish() ? "This email is already registered. Sign in instead." : "این ایمیل قبلاً ثبت‌نام شده؛ وارد حساب شو.")
          : /email not confirmed/i.test(message)
            ? (isEnglish() ? "Confirm your email before signing in." : "ابتدا ایمیل خود را تأیید کن.")
            : (isEnglish() ? "Could not complete authentication. Check the settings and try again." : "ورود انجام نشد. تنظیمات احراز هویت را بررسی و دوباره تلاش کن.");
      setAuthMessage(translated, "error");
      console.error("TALOM auth error:", message);
    } finally {
      if (submit) submit.disabled = false;
    }
  });

  signOutButton?.addEventListener("click", async () => {
    if (!authClient || signOutButton.disabled) return;

    signOutButton.disabled = true;
    setAuthMessage(isEnglish() ? "Signing out..." : "در حال خروج...");

    try {
      // Clear this browser's session locally so the customer is not left signed in
      // if a remote session-revocation request is slow or unavailable.
      const { error } = await authClient.auth.signOut({ scope: "local" });
      if (error) throw error;

      renderAuthSession(null);
      setAuthMode("signin");
      setAuthMessage(isEnglish() ? "You have signed out." : "از حساب خارج شدی.", "success");
    } catch (error) {
      console.error("TALOM sign-out error:", error);
      setAuthMessage(
        isEnglish() ? "Could not sign out. Check your connection and try again." : "خروج انجام نشد؛ اتصال اینترنت را بررسی و دوباره تلاش کن.",
        "error"
      );
    } finally {
      signOutButton.disabled = false;
    }
  });

  authClient.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      authRecoveryActive = true;
      const emailInput = $("#authEmail");
      if (emailInput && session?.user?.email) emailInput.value = session.user.email;
      renderAuthSession(session);
      setAuthMode("recovery");
      setAuthMessage(isEnglish() ? "Choose a new password for your account." : "رمز عبور جدیدی برای حساب خود انتخاب کن.");
      openModal(modal);
      return;
    }
    if (event === "SIGNED_OUT") authRecoveryActive = false;
    renderAuthSession(session);
  });

  authClient.auth.getSession().then(({ data, error }) => {
    if (error) console.error("TALOM session restore error:", error.message);
    renderAuthSession(data?.session || null);
  }).catch(error => {
    console.error("TALOM session restore error:", error);
    renderAuthSession(null);
  });

  renderAuthSession(null);
  setAuthMode("signin");
}

function setupNavigation() {
  const header = $("#siteHeader");
  const nav = $("#mainNav");
  const menuToggle = $("#mobileMenuToggle");
  const backToTop = $("#backToTop");
  const scrollProgress = $("#scrollProgress");
  const mobileQuery = window.matchMedia("(max-width: 760px)");

  function setMenuOpen(open, returnFocus = false) {
    if (!nav || !menuToggle) return;
    nav.classList.toggle("open", open && mobileQuery.matches);
    const isOpen = nav.classList.contains("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    nav.setAttribute("aria-hidden", String(mobileQuery.matches && !isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen
        ? (isEnglish() ? "Close navigation" : "بستن منو")
        : (isEnglish() ? "Open navigation" : "باز کردن منو")
    );
    if (!mobileQuery.matches) nav.classList.remove("open");
    if (returnFocus) menuToggle.focus();
  }

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
    setMenuOpen(false);
    menuToggle.addEventListener("click", () => {
      setMenuOpen(!nav.classList.contains("open"));
    });

    $$("a", nav).forEach(link => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("click", event => {
      if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
        setMenuOpen(false);
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        setMenuOpen(false, true);
      }
    });

    const handleBreakpoint = () => setMenuOpen(false);
    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener("change", handleBreakpoint);
    } else {
      mobileQuery.addListener(handleBreakpoint);
    }
  }

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
      });
    });
  }
}

function updateCarouselControls(trackId, previousId, nextId, progressId) {
  const track = document.getElementById(trackId);
  if (!track) return;
  const previous = document.getElementById(previousId);
  const next = document.getElementById(nextId);
  const progress = document.getElementById(progressId);
  const card = $(".product-card", track);
  const gap = parseFloat(getComputedStyle(track).columnGap) || 18;
  const step = card ? card.getBoundingClientRect().width + gap : 1;
  const max = Math.max(0, track.scrollWidth - track.clientWidth);
  const current = Math.min(max, Math.max(0, Math.abs(track.scrollLeft)));
  if (previous) previous.disabled = current <= 4;
  if (next) next.disabled = current >= max - 4;
  if (progress) {
    const total = track.querySelectorAll(".product-card").length;
    const visibleStart = Math.min(total, Math.floor(current / Math.max(step, 1)) + 1);
    progress.textContent = `${String(total ? visibleStart : 0).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  }
}

function updateAllCarouselControls() {
  updateCarouselControls("productGrid", "drinksPrev", "drinksNext", "drinksProgress");
  updateCarouselControls("dessertGrid", "dessertsPrev", "dessertsNext", "dessertsProgress");
  updateCarouselControls("foodGrid", "foodPrev", "foodNext", "foodProgress");
}

function setupProductCarousel() {
  const tracks = [
    { track: "productGrid", prev: "drinksPrev", next: "drinksNext" },
    { track: "dessertGrid", prev: "dessertsPrev", next: "dessertsNext" },
    { track: "foodGrid", prev: "foodPrev", next: "foodNext" }
  ];
  tracks.forEach(item => {
    const track = document.getElementById(item.track);
    const previous = document.getElementById(item.prev);
    const next = document.getElementById(item.next);
    const move = direction => {
      const card = $(".product-card", track);
      if (!card) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 18;
      const rtlSign = document.documentElement.dir === "rtl" ? -1 : 1;
      track.scrollBy({
        left: direction * rtlSign * (card.getBoundingClientRect().width + gap) * 2,
        behavior: "smooth"
      });
    };
    previous?.addEventListener("click", () => move(-1));
    next?.addEventListener("click", () => move(1));
    track?.addEventListener("scroll", updateAllCarouselControls, { passive: true });
  });
  window.addEventListener("resize", updateAllCarouselControls);
  updateAllCarouselControls();
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
    [grid, $("#dessertGrid"), $("#foodGrid")].filter(Boolean).forEach(track => {
      track.addEventListener("click", event => {
        const favoriteButton = event.target.closest("[data-favorite]");
        if (favoriteButton) {
          toggleFavorite(String(favoriteButton.dataset.favorite), favoriteButton);
          return;
        }
        const detailsButton = event.target.closest("[data-details]");
        if (detailsButton) openProduct(String(detailsButton.dataset.details));
      });
      track.addEventListener("error", event => {
        const image = event.target;
        if (!(image instanceof HTMLImageElement) || !image.matches("[data-product-image]")) return;
        if (image.dataset.fallbackApplied === "true") return;
        image.dataset.fallbackApplied = "true";
        const product = products.find(item => item.id === image.dataset.productImage);
        image.src = productPlaceholder(product ? getProductName(product) : "TALOM");
        image.classList.add("image-unavailable");
        image.alt = product ? getProductName(product) : "TALOM";
      }, true);
    });
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
    if (!activeModal) return;
    if (event.key === "Escape") {
      closeModal(activeModal);
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = $$(
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
      activeModal
    ).filter(element => element.getClientRects().length > 0);

    if (!focusable.length) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
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
    const savedTheme = localStorage.getItem("talom-theme-v2");
    const savedLanguage = localStorage.getItem("talom-language");
    const savedFavorites = JSON.parse(
      localStorage.getItem("talom-favorites") || "[]"
    );

    if (savedTheme) setTheme(savedTheme);

    if (savedLanguage === "en" || savedLanguage === "fa") {
      state.language = savedLanguage;
    }

    if (Array.isArray(savedFavorites)) {
      state.favorites = new Set(savedFavorites.map(String));
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

  setupAuth();
  setupNavigation();
  setupMenu();
  setupProductCarousel();
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

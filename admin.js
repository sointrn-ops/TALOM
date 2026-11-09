"use strict";

const SUPABASE_URL = "https://rlecvkrrdxqjepsxylee.supabase.co";
const SUPABASE_KEY = "sb_publishable__TOW24x67zjRnlas6Lb0xg_1wF0tC1g";

document.addEventListener("DOMContentLoaded", async () => {
  const loginScreen = document.getElementById("login-screen");
  const adminPanel = document.getElementById("admin-panel");
  const loginForm = document.getElementById("login-form");
  const loginMessage = document.getElementById("login-message");
  const loginButton = document.getElementById("login-btn");
  const logoutButton = document.getElementById("logout-btn");
  const productForm = document.getElementById("product-form");
  const productMessage = document.getElementById("product-message");
  const productsTableBody = document.getElementById("products-table-body");
  const productsCount = document.getElementById("products-count");
  const productId = document.getElementById("product-id");
  const productName = document.getElementById("product-name");
  const productNameEn = document.getElementById("product-name-en");
  const productCategory = document.getElementById("product-category");
  const productPrice = document.getElementById("product-price");
  const productDescription = document.getElementById("product-description");
  const productDescriptionEn = document.getElementById("product-description-en");
  const productImage = document.getElementById("product-image");
  const productAvailable = document.getElementById("product-available");
  const saveProductButton = document.getElementById("save-product-btn");
  const cancelEditButton = document.getElementById("cancel-edit-btn");
  const ordersTableBody = document.getElementById("orders-table-body");
  const ordersMessage = document.getElementById("orders-message");
  const settingsForm = document.getElementById("settings-form");
  const settingsMessage = document.getElementById("settings-message");
  const saveSettingsButton = document.getElementById("save-settings-btn");

  const categoryNames = {
    coffee: "قهوه", cold: "نوشیدنی سرد", special: "نوشیدنی ویژه",
    dessert: "دسر", food: "غذا"
  };
  const orderStatuses = {
    pending: "در انتظار", confirmed: "تأیید شده",
    preparing: "در حال آماده‌سازی", completed: "تکمیل شده",
    cancelled: "لغو شده"
  };

  let supabaseClient = null;
  let products = [];
  let orders = [];

  function showLogin(message = "") {
    loginScreen.hidden = false;
    adminPanel.hidden = true;
    loginMessage.textContent = message;
  }

  function showProductMessage(message, isError = false) {
    productMessage.textContent = message;
    productMessage.classList.toggle("is-error", isError);
    productMessage.classList.toggle("is-success", Boolean(message) && !isError);
  }

  function showOrdersMessage(message, isError = false) {
    ordersMessage.textContent = message;
    ordersMessage.classList.toggle("is-error", isError);
    ordersMessage.classList.toggle("is-success", Boolean(message) && !isError);
  }

  function showSettingsMessage(message, isError = false) {
    settingsMessage.textContent = message;
    settingsMessage.classList.toggle("is-error", isError);
    settingsMessage.classList.toggle("is-success", Boolean(message) && !isError);
  }

  function resetProductForm() {
    productForm.reset();
    productId.value = "";
    saveProductButton.textContent = "ذخیره محصول";
    cancelEditButton.hidden = true;
    showProductMessage("");
  }

  function formatMoney(value) {
    return Number(value || 0).toLocaleString("fa-IR") + " تومان";
  }

  function tehranDateKey(value = new Date()) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Tehran", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(value);
    const get = type => parts.find(part => part.type === type)?.value || "";
    return get("year") + "-" + get("month") + "-" + get("day");
  }

  function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Tehran"
    }).format(date);
  }

  function appendCell(row, value) {
    const cell = document.createElement("td");
    cell.textContent = value == null || value === "" ? "—" : String(value);
    row.appendChild(cell);
    return cell;
  }

  function updateDashboard() {
    const today = tehranDateKey();
    const todaysOrders = orders.filter(order => tehranDateKey(new Date(order.created_at)) === today);
    const completedSales = todaysOrders
      .filter(order => order.status === "completed")
      .reduce((sum, order) => sum + Number(order.total || 0), 0);
    const pending = orders.filter(order => order.status === "pending").length;

    document.getElementById("today-sales").textContent = formatMoney(completedSales);
    document.getElementById("today-orders").textContent = todaysOrders.length.toLocaleString("fa-IR");
    document.getElementById("pending-orders").textContent = pending.toLocaleString("fa-IR");
    productsCount.textContent = products.length.toLocaleString("fa-IR");
  }

  async function loadProducts() {
    productsTableBody.textContent = "در حال دریافت محصولات...";
    const { data, error } = await supabaseClient
      .from("products").select("*").order("created_at", { ascending: false }).limit(500);

    if (error) throw error;
    products = data || [];
    renderProducts();
    updateDashboard();
  }

  function renderProducts() {
    productsTableBody.replaceChildren();
    if (!products.length) {
      const row = document.createElement("tr");
      const cell = appendCell(row, "محصولی ثبت نشده است.");
      cell.colSpan = 6;
      productsTableBody.appendChild(row);
      updateDashboard();
      return;
    }

    products.forEach(product => {
      const row = document.createElement("tr");
      appendCell(row, String(product.id).slice(0, 8));
      appendCell(row, product.name);
      appendCell(row, categoryNames[product.category] || product.category);
      appendCell(row, formatMoney(product.price));
      appendCell(row, product.is_available ? "موجود" : "ناموجود");

      const actions = document.createElement("td");
      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "primary-btn";
      editButton.textContent = "ویرایش";
      editButton.addEventListener("click", () => editProduct(product.id));

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "danger-btn";
      deleteButton.textContent = "حذف";
      deleteButton.addEventListener("click", () => deleteProduct(product.id));

      actions.append(editButton, deleteButton);
      row.appendChild(actions);
      productsTableBody.appendChild(row);
    });
    updateDashboard();
  }

  function editProduct(id) {
    // Product IDs are UUID strings; never coerce them to numbers.
    const product = products.find(item => String(item.id) === String(id));
    if (!product) return;

    productId.value = String(product.id);
    productName.value = product.name || "";
    productNameEn.value = product.name_en || "";
    productCategory.value = product.category || "coffee";
    productPrice.value = product.price ?? "";
    productDescription.value = product.description || "";
    productDescriptionEn.value = product.description_en || "";
    productImage.value = product.image_url || "";
    productAvailable.value = String(product.is_available);

    saveProductButton.textContent = "ذخیره تغییرات";
    cancelEditButton.hidden = false;
    document.getElementById("products").scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
    showProductMessage("در حال ویرایش محصول: " + product.name);
  }

  async function deleteProduct(id) {
    const product = products.find(item => String(item.id) === String(id));
    if (!product) return;
    if (!window.confirm("آیا از حذف محصول «" + product.name + "» مطمئن هستید؟")) return;

    try {
      const { data, error } = await supabaseClient
        .from("products").delete().eq("id", String(id)).select("id");
      if (error) throw error;
      if (!Array.isArray(data) || data.length !== 1) {
        throw new Error("No product row was deleted.");
      }
      if (productId.value === String(id)) resetProductForm();
      showProductMessage("محصول با موفقیت حذف شد.");
      await loadProducts();
    } catch (error) {
      console.error("Product delete error:", error);
      showProductMessage("حذف محصول انجام نشد. دسترسی مدیر را بررسی کنید.", true);
    }
  }

  async function loadOrders() {
    ordersTableBody.textContent = "در حال دریافت سفارش‌ها...";
    const { data, error } = await supabaseClient
      .from("orders")
      .select("id,customer_name,phone,address,total,status,created_at,order_items(product_name,quantity,unit_price)")
      .order("created_at", { ascending: false }).limit(200);
    if (error) throw error;
    orders = data || [];
    renderOrders();
    updateDashboard();
  }

  function renderOrders() {
    ordersTableBody.replaceChildren();
    if (!orders.length) {
      const row = document.createElement("tr");
      const cell = appendCell(row, "هنوز سفارشی ثبت نشده است.");
      cell.colSpan = 6;
      ordersTableBody.appendChild(row);
      updateDashboard();
      return;
    }

    orders.forEach(order => {
      const row = document.createElement("tr");
      appendCell(row, String(order.id).slice(0, 8));
      const customer = appendCell(row, order.customer_name);
      if (order.address) customer.title = order.address;
      appendCell(row, order.phone);
      appendCell(row, formatMoney(order.total));
      appendCell(row, formatDate(order.created_at));

      const statusCell = document.createElement("td");
      const select = document.createElement("select");
      select.className = "order-status-select";
      Object.entries(orderStatuses).forEach(([value, label]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        option.selected = order.status === value;
        select.appendChild(option);
      });
      select.addEventListener("change", async () => {
        select.disabled = true;
        try {
          const { data, error } = await supabaseClient
            .from("orders").update({ status: select.value })
            .eq("id", order.id).select("id,status");
          if (error) throw error;
          if (!Array.isArray(data) || data.length !== 1) {
            throw new Error("Order status was not updated.");
          }
          order.status = select.value;
          showOrdersMessage("وضعیت سفارش به‌روزرسانی شد.");
          updateDashboard();
        } catch (error) {
          console.error("Order update error:", error);
          select.value = order.status;
          showOrdersMessage("به‌روزرسانی وضعیت سفارش ناموفق بود.", true);
        } finally {
          select.disabled = false;
        }
      });
      statusCell.appendChild(select);
      row.appendChild(statusCell);
      ordersTableBody.appendChild(row);
    });
    updateDashboard();
  }

  async function loadSettings() {
    const { data, error } = await supabaseClient
      .from("site_settings")
      .select("id,cafe_name,phone,instagram,telegram").eq("id", 1).maybeSingle();
    if (error) throw error;
    if (!data) return;

    document.getElementById("setting-cafe-name").value = data.cafe_name || "TALOM";
    document.getElementById("setting-phone").value = data.phone || "";
    document.getElementById("setting-instagram").value = data.instagram || "";
    document.getElementById("setting-telegram").value = data.telegram || "";
  }

  async function checkAdmin() {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error || !user) {
      showLogin();
      return false;
    }

    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles").select("full_name,role").eq("id", user.id).single();

    if (profileError || !profile || profile.role !== "admin") {
      await supabaseClient.auth.signOut();
      showLogin("شما اجازه دسترسی به پنل مدیریت را ندارید.");
      return false;
    }

    loginScreen.hidden = true;
    adminPanel.hidden = false;
    document.getElementById("admin-name").textContent = profile.full_name || "TALOM Admin";
    document.getElementById("current-date").textContent =
      new Intl.DateTimeFormat("fa-IR", { dateStyle: "full", timeZone: "Asia/Tehran" }).format(new Date());

    const results = await Promise.allSettled([loadProducts(), loadOrders(), loadSettings()]);
    if (results[0].status === "rejected") {
      productsTableBody.textContent = "خطا در دریافت محصولات.";
      showProductMessage("دریافت محصولات ناموفق بود. اتصال و دسترسی دیتابیس را بررسی کنید.", true);
    }
    if (results[1].status === "rejected") {
      ordersTableBody.textContent = "خطا در دریافت سفارش‌ها.";
      showOrdersMessage("دریافت سفارش‌ها ناموفق بود.", true);
    }
    if (results[2].status === "rejected") {
      showSettingsMessage("دریافت تنظیمات ناموفق بود.", true);
    }
    updateDashboard();
    return true;
  }

  if (!window.supabase?.createClient) {
    showLogin("کتابخانه اتصال به سرور بارگذاری نشد. صفحه را تازه‌سازی کنید.");
    return;
  }
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  productForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!productForm.reportValidity()) return;

    saveProductButton.disabled = true;
    saveProductButton.textContent = "در حال ذخیره...";
    const editingId = productId.value.trim();

    try {
      const price = Number(productPrice.value);
      if (!Number.isFinite(price) || price < 0) {
        showProductMessage("قیمت واردشده معتبر نیست.", true);
        return;
      }

      const imageUrl = productImage.value.trim();
      if (imageUrl) {
        let parsed;
        try { parsed = new URL(imageUrl); }
        catch { showProductMessage("آدرس تصویر معتبر نیست.", true); return; }
        if (parsed.protocol !== "https:" || parsed.username || parsed.password) {
          showProductMessage("آدرس تصویر باید HTTPS معتبر و بدون اطلاعات ورود باشد.", true);
          return;
        }
      }

      const productData = {
        name: productName.value.trim(),
        name_en: productNameEn.value.trim() || null,
        category: productCategory.value,
        price,
        description: productDescription.value.trim(),
        description_en: productDescriptionEn.value.trim() || null,
        image_url: imageUrl || null,
        is_available: productAvailable.value === "true"
      };
      if (!productData.name) {
        showProductMessage("نام محصول را وارد کنید.", true);
        return;
      }

      const query = editingId
        ? supabaseClient.from("products").update(productData).eq("id", editingId)
        : supabaseClient.from("products").insert(productData);
      const { data, error } = await query.select("id");
      if (error) throw error;
      if (!Array.isArray(data) || data.length !== 1) {
        throw new Error("No product row was changed.");
      }

      showProductMessage(editingId ? "محصول با موفقیت ویرایش شد." : "محصول جدید با موفقیت اضافه شد.");
      resetProductForm();
      await loadProducts();
    } catch (error) {
      console.error("Product save error:", error);
      showProductMessage("ذخیره محصول انجام نشد. اطلاعات و دسترسی مدیر را بررسی کنید.", true);
    } finally {
      saveProductButton.disabled = false;
      saveProductButton.textContent = productId.value ? "ذخیره تغییرات" : "ذخیره محصول";
    }
  });

  cancelEditButton.addEventListener("click", resetProductForm);

  settingsForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!settingsForm.reportValidity()) return;
    saveSettingsButton.disabled = true;
    saveSettingsButton.textContent = "در حال ذخیره...";
    try {
      const settings = {
        cafe_name: document.getElementById("setting-cafe-name").value.trim(),
        phone: document.getElementById("setting-phone").value.trim() || null,
        instagram: document.getElementById("setting-instagram").value.trim() || null,
        telegram: document.getElementById("setting-telegram").value.trim() || null
      };
      for (const key of ["instagram", "telegram"]) {
        if (settings[key]) {
          const url = new URL(settings[key]);
          if (url.protocol !== "https:" || url.username || url.password) {
            throw new Error("لینک‌ها باید HTTPS معتبر باشند.");
          }
        }
      }
      const { data, error } = await supabaseClient
        .from("site_settings").update(settings).eq("id", 1).select("id");
      if (error) throw error;
      if (!Array.isArray(data) || data.length !== 1) {
        throw new Error("تنظیمات ذخیره نشد.");
      }
      showSettingsMessage("تنظیمات با موفقیت ذخیره شد.");
    } catch (error) {
      console.error("Settings save error:", error);
      showSettingsMessage(error.message || "ذخیره تنظیمات ناموفق بود.", true);
    } finally {
      saveSettingsButton.disabled = false;
      saveSettingsButton.textContent = "ذخیره تنظیمات";
    }
  });

  loginForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!loginForm.reportValidity()) return;
    loginButton.disabled = true;
    loginButton.textContent = "در حال ورود...";
    loginMessage.textContent = "";
    try {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) {
        showLogin("ایمیل یا رمز عبور اشتباه است.");
        return;
      }
      await checkAdmin();
    } catch (error) {
      console.error("Admin login error:", error);
      showLogin("خطا در اتصال به سرور. دوباره تلاش کنید.");
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = "ورود به پنل";
    }
  });

  logoutButton.addEventListener("click", async event => {
    event.preventDefault();
    logoutButton.setAttribute("aria-disabled", "true");
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      showLogin("از حساب خود خارج شدید.");
    } catch (error) {
      console.error("Admin sign-out error:", error);
      showOrdersMessage("خروج از حساب انجام نشد. اتصال را بررسی کنید و دوباره تلاش کنید.", true);
    } finally {
      logoutButton.removeAttribute("aria-disabled");
    }
  });

  supabaseClient.auth.onAuthStateChange(event => {
    if (event === "SIGNED_OUT") showLogin("نشست شما پایان یافت. دوباره وارد شوید.");
  });

  const adminNavLinks = document.querySelectorAll(".sidebar .nav-link[href^='#']:not(#logout-btn)");
  adminNavLinks.forEach(link => {
    link.addEventListener("click", () => {
      adminNavLinks.forEach(item => item.classList.remove("active"));
      link.classList.add("active");
    });
  });

  try {
    await checkAdmin();
  } catch (error) {
    console.error("Admin initialization error:", error);
    showLogin("خطا در اتصال به سرور. صفحه را تازه‌سازی کنید.");
  }
});

"use strict";

const SUPABASE_URL = "https://rlecvkrrdxqjepsxylee.supabase.co";
const SUPABASE_KEY = "sb_publishable__TOW24x67zjRnlas6Lb0xg_1wF0tC1g";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

document.addEventListener("DOMContentLoaded", async () => {
  const $ = (id) => document.getElementById(id);
  const loginScreen = $("login-screen");
  const adminPanel = $("admin-panel");
  const loginForm = $("login-form");
  const resetForm = $("reset-password-form");
  const loginMessage = $("login-message");
  const resetMessage = $("reset-password-message");
  const loginButton = $("login-btn");
  const logoutButton = $("logout-btn");
  const forgotButton = $("forgot-password-btn");
  const resetButton = $("reset-password-btn");
  const productForm = $("product-form");
  const productMessage = $("product-message");
  const ordersMessage = $("orders-message");
  const settingsMessage = $("settings-message");
  const productBody = $("products-table-body");
  const orderBody = $("orders-table-body");
  const categoryNames = { coffee: "قهوه", cold: "نوشیدنی سرد", special: "نوشیدنی ویژه", dessert: "دسر", food: "غذا" };
  const statusLabels = { pending: "در انتظار بررسی", confirmed: "تأیید شده", preparing: "در حال آماده‌سازی", completed: "تکمیل شده", cancelled: "لغو شده" };
  let products = [];
  let orders = [];
  let settingsLoaded = false;
  let activeUser = null;

  function message(node, text, error = false) {
    node.textContent = text || "";
    node.style.color = error ? "#a64f43" : "#5c8067";
  }
  function formatMoney(value) {
    return Number(value || 0).toLocaleString("fa-IR") + " تومان";
  }
  function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("fa-IR", { dateStyle: "medium", timeStyle: "short" });
  }
  function localIso(date) {
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const pad = (n) => String(Math.floor(Math.abs(n))).padStart(2, "0");
    return date.getFullYear() + "-" + pad(date.getMonth()+1) + "-" + pad(date.getDate()) +
      "T" + pad(date.getHours()) + ":" + pad(date.getMinutes()) + ":" + pad(date.getSeconds()) +
      sign + pad(offset / 60) + ":" + pad(offset % 60);
  }
  function setLogin(text = "") {
    loginScreen.hidden = false;
    adminPanel.hidden = true;
    loginForm.hidden = false;
    resetForm.hidden = true;
    message(loginMessage, text, !!text);
  }
  function setAdminName(name) {
    $("admin-name") && ($("admin-name").textContent = name);
    $("sidebar-admin-name").textContent = name;
  }
  function resetProductForm() {
    productForm.reset();
    $("product-id").value = "";
    $("product-form-title").textContent = "افزودن محصول جدید";
    $("save-product-btn").textContent = "ذخیره محصول";
    $("cancel-edit-btn").hidden = true;
    message(productMessage, "");
  }
  async function requireAdmin() {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error || !user) { setLogin(); return false; }
    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles").select("full_name, role").eq("id", user.id).maybeSingle();
    if (profileError || !profile || profile.role !== "admin") {
      await supabaseClient.auth.signOut();
      setLogin("این حساب دسترسی مدیر ندارد.");
      return false;
    }
    activeUser = user;
    loginScreen.hidden = true;
    adminPanel.hidden = false;
    setAdminName(profile.full_name || "TALOM Admin");
    $("current-date").textContent = new Date().toLocaleDateString("fa-IR", { dateStyle: "full" });
    await refreshAll();
    return true;
  }

  async function refreshAll() {
    await Promise.all([loadProducts(), loadOrders(), loadSettings()]);
    await loadDashboardStats();
    renderRecentOrders();
  }

  async function loadProducts() {
    productBody.innerHTML = '<tr><td colspan="5" class="empty-row">در حال دریافت محصولات...</td></tr>';
    const { data, error } = await supabaseClient.from("products")
      .select("id,name,name_en,category,description,price,image_url,is_available,created_at")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Products:", error);
      productBody.innerHTML = '<tr><td colspan="5" class="empty-row">دریافت محصولات ناموفق بود. اتصال و مجوزها را بررسی کنید.</td></tr>';
      message(productMessage, "خطا در دریافت محصولات.", true);
      return;
    }
    products = data || [];
    $("products-count").textContent = products.length.toLocaleString("fa-IR");
    $("inventory-count").textContent = products.length.toLocaleString("fa-IR") + " مورد";
    renderProducts();
  }

  function renderProducts() {
    const term = $("product-search").value.trim().toLocaleLowerCase();
    const category = $("product-category-filter").value;
    const filtered = products.filter(p => {
      const matchesTerm = [p.name, p.name_en, p.category].some(v => String(v || "").toLocaleLowerCase().includes(term));
      return matchesTerm && (category === "all" || p.category === category);
    });
    productBody.replaceChildren();
    if (!filtered.length) {
      const tr = document.createElement("tr"), td = document.createElement("td");
      td.colSpan = 5; td.className = "empty-row"; td.textContent = "محصولی با این مشخصات پیدا نشد.";
      tr.append(td); productBody.append(tr); return;
    }
    filtered.forEach(product => {
      const tr = document.createElement("tr");
      const nameTd = document.createElement("td");
      const nameWrap = document.createElement("div"); nameWrap.className = "product-name-cell";
      if (product.image_url) {
        const img = document.createElement("img"); img.className = "product-thumb"; img.loading = "lazy";
        img.src = product.image_url; img.alt = ""; img.onerror = () => { img.replaceWith(makeThumbPlaceholder()); };
        nameWrap.append(img);
      } else nameWrap.append(makeThumbPlaceholder());
      const name = document.createElement("div"), strong = document.createElement("strong"), small = document.createElement("small");
      strong.textContent = product.name || "بدون نام"; small.textContent = product.name_en || "—";
      name.append(strong, small); nameWrap.append(name); nameTd.append(nameWrap);
      const categoryTd = document.createElement("td"); categoryTd.textContent = categoryNames[product.category] || product.category || "—";
      const priceTd = document.createElement("td"); priceTd.textContent = formatMoney(product.price);
      const statusTd = document.createElement("td"); const status = document.createElement("span");
      status.className = "availability" + (product.is_available ? "" : " off");
      status.textContent = product.is_available ? "موجود" : "ناموجود"; statusTd.append(status);
      const actionTd = document.createElement("td"), actions = document.createElement("div"); actions.className = "row-actions";
      const edit = document.createElement("button"); edit.type = "button"; edit.className = "mini-btn"; edit.textContent = "ویرایش";
      edit.addEventListener("click", () => editProduct(product.id));
      const del = document.createElement("button"); del.type = "button"; del.className = "mini-btn delete"; del.textContent = "حذف";
      del.addEventListener("click", () => deleteProduct(product.id));
      actions.append(edit, del); actionTd.append(actions); tr.append(nameTd, categoryTd, priceTd, statusTd, actionTd);
      productBody.append(tr);
    });
  }
  function makeThumbPlaceholder() {
    const el = document.createElement("span"); el.className = "product-thumb product-thumb-placeholder"; el.textContent = "T"; return el;
  }
  function editProduct(id) {
    const p = products.find(item => item.id === id);
    if (!p) return;
    $("product-id").value = p.id;
    $("product-name").value = p.name || "";
    $("product-name-en").value = p.name_en || "";
    $("product-category").value = p.category || "coffee";
    $("product-price").value = p.price ?? "";
    $("product-description").value = p.description || "";
    $("product-image").value = p.image_url || "";
    $("product-available").value = String(!!p.is_available);
    $("product-form-title").textContent = "ویرایش محصول";
    $("save-product-btn").textContent = "ذخیره تغییرات";
    $("cancel-edit-btn").hidden = false;
    $("products").scrollIntoView({ behavior: "smooth", block: "start" });
    message(productMessage, "در حال ویرایش: " + p.name);
  }
  async function deleteProduct(id) {
    const p = products.find(item => item.id === id);
    if (!p || !window.confirm("محصول «" + p.name + "» حذف شود؟ این عملیات قابل بازگشت نیست.")) return;
    const { error } = await supabaseClient.from("products").delete().eq("id", id);
    if (error) {
      console.error("Delete product:", error);
      message(productMessage, "حذف انجام نشد. ممکن است محصول در سفارش‌ها استفاده شده باشد.", true);
      return;
    }
    if ($("product-id").value === id) resetProductForm();
    message(productMessage, "محصول حذف شد.");
    await loadProducts();
  }

  productForm.addEventListener("submit", async event => {
    event.preventDefault();
    const button = $("save-product-btn");
    const editingId = $("product-id").value;
    const price = Number($("product-price").value);
    const name = $("product-name").value.trim();
    if (!name || !Number.isSafeInteger(price) || price < 1) {
      message(productMessage, "نام محصول و قیمت صحیح (عدد صحیح بیشتر از صفر) الزامی است.", true); return;
    }
    const data = {
      name, name_en: $("product-name-en").value.trim() || null,
      category: $("product-category").value, price,
      description: $("product-description").value.trim() || null,
      image_url: $("product-image").value.trim() || null,
      is_available: $("product-available").value === "true"
    };
    button.disabled = true; button.textContent = "در حال ذخیره...";
    try {
      const result = editingId
        ? await supabaseClient.from("products").update(data).eq("id", editingId).select("id").maybeSingle()
        : await supabaseClient.from("products").insert(data).select("id").single();
      if (result.error) throw result.error;
      if (!result.data) throw new Error("No product row was returned. Check admin update policy.");
      resetProductForm();
      message(productMessage, editingId ? "تغییرات محصول ذخیره شد." : "محصول جدید اضافه شد.");
      await loadProducts();
    } catch (error) {
      console.error("Save product:", error);
      message(productMessage, "ذخیره محصول انجام نشد. ورودی‌ها و مجوز مدیر را بررسی کنید.", true);
    } finally {
      button.disabled = false;
      button.textContent = $("product-id").value ? "ذخیره تغییرات" : "ذخیره محصول";
    }
  });
  $("cancel-edit-btn").addEventListener("click", resetProductForm);
  $("product-search").addEventListener("input", renderProducts);
  $("product-category-filter").addEventListener("change", renderProducts);

  async function loadOrders() {
    orderBody.innerHTML = '<tr><td colspan="7" class="empty-row">در حال دریافت سفارش‌ها...</td></tr>';
    const { data, error } = await supabaseClient.from("orders")
      .select("id,customer_name,phone,address,total,status,created_at,order_items(product_name,quantity,unit_price)")
      .order("created_at", { ascending: false }).limit(200);
    if (error) {
      console.error("Orders:", error);
      orderBody.innerHTML = '<tr><td colspan="7" class="empty-row">دریافت سفارش‌ها ناموفق بود.</td></tr>';
      message(ordersMessage, "خطا در دریافت سفارش‌ها.", true);
      return;
    }
    orders = data || [];
    message(ordersMessage, orders.length.toLocaleString("fa-IR") + " سفارش اخیر دریافت شد.");
    renderOrders(); renderRecentOrders();
    $("nav-pending-count").textContent = orders.filter(o => o.status === "pending").length.toLocaleString("fa-IR");
  }
  function renderOrders() {
    const term = $("order-search").value.trim().toLocaleLowerCase();
    const statusFilter = $("order-status-filter").value;
    const filtered = orders.filter(o => {
      const haystack = [o.customer_name, o.phone, o.id, o.address].join(" ").toLocaleLowerCase();
      return haystack.includes(term) && (statusFilter === "all" || o.status === statusFilter);
    });
    orderBody.replaceChildren();
    if (!filtered.length) {
      const tr = document.createElement("tr"), td = document.createElement("td");
      td.colSpan = 7; td.className = "empty-row"; td.textContent = "سفارشی مطابق فیلترها پیدا نشد.";
      tr.append(td); orderBody.append(tr); return;
    }
    filtered.forEach(order => {
      const tr = document.createElement("tr");
      const codeTd = document.createElement("td"), code = document.createElement("span");
      code.className = "order-code"; code.textContent = String(order.id).slice(0, 8).toUpperCase(); codeTd.append(code);
      const customerTd = document.createElement("td"), customer = document.createElement("div");
      customer.className = "customer-cell"; const customerName = document.createElement("strong"), address = document.createElement("button"), addressText = document.createElement("small");
      customerName.textContent = order.customer_name || "مشتری"; address.className = "address-link"; address.type = "button";
      address.textContent = order.address ? "نمایش نشانی کامل" : "نشانی ثبت نشده";
      address.disabled = !order.address; address.addEventListener("click", () => window.alert("نشانی سفارش " + code.textContent + ":\n" + order.address));
      addressText.textContent = order.address ? "نشانی ارسال" : "بدون نشانی";
      customer.append(customerName, addressText, address); customerTd.append(customer);
      const contactTd = document.createElement("td"); contactTd.textContent = order.phone || "—";
      const totalTd = document.createElement("td"); totalTd.textContent = formatMoney(order.total);
      const itemsTd = document.createElement("td");
      itemsTd.textContent = (order.order_items || []).map(i => (i.product_name || "محصول") + " × " + i.quantity).join("، ") || "—";
      const dateTd = document.createElement("td"); dateTd.textContent = formatDate(order.created_at);
      const statusTd = document.createElement("td"), select = document.createElement("select");
      select.className = "status-select"; select.setAttribute("aria-label", "وضعیت سفارش " + code.textContent);
      Object.entries(statusLabels).forEach(([value, label]) => { const opt = document.createElement("option"); opt.value = value; opt.textContent = label; select.append(opt); });
      select.value = order.status; select.addEventListener("change", () => updateOrderStatus(order, select));
      statusTd.append(select); tr.append(codeTd, customerTd, contactTd, totalTd, itemsTd, dateTd, statusTd); orderBody.append(tr);
    });
  }
  async function updateOrderStatus(order, select) {
    const previous = order.status, next = select.value;
    if (next === previous) return;
    if (next === "cancelled" && !window.confirm("لغو سفارش " + String(order.id).slice(0, 8) + " را تأیید می‌کنید؟")) {
      select.value = previous; return;
    }
    select.disabled = true; message(ordersMessage, "در حال ذخیره وضعیت سفارش...");
    try {
      const { data, error } = await supabaseClient.from("orders").update({ status: next })
        .eq("id", order.id).select("id,status").maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("No order row updated; verify admin policy.");
      order.status = data.status;
      message(ordersMessage, "وضعیت سفارش ذخیره شد.");
      renderOrders();
      await loadDashboardStats();
      renderRecentOrders();
    } catch (error) {
      console.error("Update order:", error);
      select.value = previous;
      message(ordersMessage, "تغییر وضعیت ذخیره نشد؛ وضعیت قبلی حفظ شد.", true);
    } finally { select.disabled = false; }
  }

  async function loadDashboardStats() {
    const start = new Date(); start.setHours(0,0,0,0);
    const end = new Date(start); end.setDate(end.getDate()+1);
    const [all, pending, sales] = await Promise.all([
      supabaseClient.from("orders").select("id", { count: "exact", head: true }),
      supabaseClient.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabaseClient.from("orders").select("total").eq("status", "completed")
        .gte("created_at", localIso(start)).lt("created_at", localIso(end))
    ]);
    if (all.error || pending.error || sales.error) {
      console.error("Dashboard stats:", all.error || pending.error || sales.error);
      message(ordersMessage, "بخشی از آمار داشبورد دریافت نشد.", true); return;
    }
    $("orders-count").textContent = Number(all.count || 0).toLocaleString("fa-IR");
    $("new-orders-count").textContent = Number(pending.count || 0).toLocaleString("fa-IR");
    $("today-sales").innerHTML = "";
    const amount = document.createElement("span"); amount.textContent = Number((sales.data || []).reduce((sum, o) => sum + Number(o.total || 0), 0)).toLocaleString("fa-IR");
    const unit = document.createElement("small"); unit.textContent = " تومان";
    $("today-sales").append(amount, unit);
  }
  function renderRecentOrders() {
    const target = $("recent-orders"); target.replaceChildren();
    if (!orders.length) { const p = document.createElement("p"); p.className = "muted"; p.textContent = "هنوز سفارشی ثبت نشده است."; target.append(p); return; }
    orders.slice(0, 4).forEach(order => {
      const row = document.createElement("div"); row.className = "recent-row";
      const avatar = document.createElement("span"); avatar.className = "recent-avatar"; avatar.textContent = "▤";
      const main = document.createElement("div"); main.className = "recent-main";
      const strong = document.createElement("strong"); strong.textContent = order.customer_name || "مشتری";
      const small = document.createElement("small"); small.textContent = statusLabels[order.status] || order.status;
      main.append(strong, small);
      const price = document.createElement("span"); price.className = "recent-price"; price.textContent = formatMoney(order.total);
      row.append(avatar, main, price); target.append(row);
    });
  }

  async function loadSettings() {
    const { data, error } = await supabaseClient.from("site_settings")
      .select("id,cafe_name,phone,instagram,telegram").eq("id", 1).maybeSingle();
    if (error) {
      console.error("Settings:", error); message(settingsMessage, "تنظیمات دریافت نشد.", true); return;
    }
    if (data) {
      $("setting-cafe-name").value = data.cafe_name || "TALOM";
      $("setting-phone").value = data.phone || "";
      $("setting-instagram").value = data.instagram || "";
      $("setting-telegram").value = data.telegram || "";
      settingsLoaded = true;
    } else {
      message(settingsMessage, "رکورد تنظیمات اصلی پیدا نشد؛ قبل از ذخیره، ساختار دیتابیس را بررسی کنید.", true);
    }
  }
  $("settings-form").addEventListener("submit", async event => {
    event.preventDefault();
    if (!settingsLoaded) { message(settingsMessage, "تنظیمات اولیه بارگذاری نشده است؛ ذخیره متوقف شد.", true); return; }
    const button = $("save-settings-btn");
    const cafeName = $("setting-cafe-name").value.trim();
    const phone = $("setting-phone").value.trim();
    const instagram = $("setting-instagram").value.trim();
    const telegram = $("setting-telegram").value.trim();
    if (!cafeName) { message(settingsMessage, "نام کافه الزامی است.", true); return; }
    for (const [label, value] of [["اینستاگرام", instagram], ["تلگرام", telegram]]) {
      if (value && !/^(https?:\/\/|@)[^\s]+$/i.test(value)) {
        message(settingsMessage, "آدرس " + label + " باید لینک معتبر یا شناسه با @ باشد.", true); return;
      }
    }
    button.disabled = true; button.textContent = "در حال ذخیره...";
    try {
      const { data, error } = await supabaseClient.from("site_settings")
        .update({ cafe_name: cafeName, phone: phone || null, instagram: instagram || null, telegram: telegram || null })
        .eq("id", 1).select("id").maybeSingle();
      if (error) throw error;
      if (!data) throw new Error("Settings row was not updated.");
      message(settingsMessage, "تنظیمات کافه با موفقیت ذخیره شد.");
    } catch (error) {
      console.error("Save settings:", error); message(settingsMessage, "ذخیره تنظیمات انجام نشد؛ مجوز مدیر را بررسی کنید.", true);
    } finally { button.disabled = false; button.textContent = "ذخیره تنظیمات"; }
  });

  loginForm.addEventListener("submit", async event => {
    event.preventDefault(); loginButton.disabled = true; loginButton.textContent = "در حال ورود...";
    message(loginMessage, "");
    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email: $("email").value.trim(), password: $("password").value
      });
      if (error) { message(loginMessage, "ورود انجام نشد. ایمیل و رمز عبور را بررسی کنید.", true); return; }
      await requireAdmin();
    } catch (error) {
      console.error("Login:", error); message(loginMessage, "اتصال برقرار نشد. دوباره تلاش کنید.", true);
    } finally { loginButton.disabled = false; loginButton.textContent = "ورود به پنل ←"; }
  });
  logoutButton.addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) { setLogin("خروج از حساب انجام نشد."); return; }
    setLogin("از حساب خارج شدید.");
  });
  forgotButton.addEventListener("click", async () => {
    const email = $("email").value.trim();
    if (!email) { message(loginMessage, "ابتدا ایمیل مدیر را وارد کنید.", true); return; }
    forgotButton.disabled = true;
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + window.location.pathname });
      if (error) throw error;
      message(loginMessage, "اگر ایمیل ثبت شده باشد، لینک بازیابی ارسال می‌شود. پوشه Spam را هم بررسی کنید.");
    } catch (error) {
      console.error("Recovery:", error); message(loginMessage, "ارسال لینک بازیابی انجام نشد. تنظیمات ایمیل و Redirect URL را بررسی کنید.", true);
    } finally { forgotButton.disabled = false; }
  });
  resetForm.addEventListener("submit", async event => {
    event.preventDefault();
    const password = $("new-password").value, confirm = $("confirm-password").value;
    if (password.length < 8 || password !== confirm) { message(resetMessage, password.length < 8 ? "رمز باید حداقل ۸ کاراکتر باشد." : "تکرار رمز با رمز جدید یکسان نیست.", true); return; }
    resetButton.disabled = true;
    try {
      const { error } = await supabaseClient.auth.updateUser({ password });
      if (error) throw error;
      await supabaseClient.auth.signOut();
      resetForm.reset(); resetForm.hidden = true; loginForm.hidden = false;
      message(loginMessage, "رمز تغییر کرد. اکنون با رمز جدید وارد شوید.");
    } catch (error) {
      console.error("Password update:", error); message(resetMessage, "تغییر رمز انجام نشد؛ ممکن است لینک منقضی شده باشد.", true);
    } finally { resetButton.disabled = false; }
  });
  supabaseClient.auth.onAuthStateChange(event => {
    if (event === "PASSWORD_RECOVERY") {
      loginScreen.hidden = false; adminPanel.hidden = true; loginForm.hidden = true; resetForm.hidden = false;
      message(loginMessage, "");
    } else if (event === "SIGNED_OUT") {
      activeUser = null; resetForm.hidden = true; loginForm.hidden = false; loginForm.reset();
      if (!loginScreen.hidden) message(loginMessage, "");
      adminPanel.hidden = true;
    }
  });

  $("refresh-orders").addEventListener("click", async event => {
    const button = event.currentTarget; button.disabled = true; button.textContent = "در حال دریافت...";
    try { await loadOrders(); await loadDashboardStats(); }
    finally { button.disabled = false; button.textContent = "↻ دریافت آخرین سفارش‌ها"; }
  });
  $("refresh-all-btn").addEventListener("click", async event => {
    const button = event.currentTarget; button.disabled = true; button.textContent = "در حال به‌روزرسانی...";
    try { await refreshAll(); }
    finally { button.disabled = false; button.textContent = "↻ به‌روزرسانی"; }
  });
  $("order-search").addEventListener("input", renderOrders);
  $("order-status-filter").addEventListener("change", renderOrders);
  $("mobile-menu-btn").addEventListener("click", () => $("sidebar").classList.toggle("mobile-open"));
  document.querySelectorAll(".nav-link, .quick-link, .inline-link, .brand-lockup").forEach(link => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".nav-link").forEach(item => item.classList.toggle("active", item.hash === link.hash));
      $("sidebar").classList.remove("mobile-open");
      const target = link.hash && document.querySelector(link.hash);
      if (target && target.id) $("page-title").textContent = ({ dashboard: "نمای کلی", orders: "مدیریت سفارش‌ها", products: "مدیریت محصولات", settings: "تنظیمات کافه" })[target.id] || "مدیریت";
    });
  });

  try { await requireAdmin(); }
  catch (error) { console.error("Initial session:", error); setLogin("ارتباط با سرویس برقرار نشد. صفحه را دوباره بارگذاری کنید."); }
});
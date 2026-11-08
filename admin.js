
"use strict";

const SUPABASE_URL = "https://rlecvkrrdxqjepsxylee.supabase.co";
const SUPABASE_KEY = "sb_publishable__TOW24x67zjRnlas6Lb0xg_1wF0tC1g";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

document.addEventListener("DOMContentLoaded", async () => {
  const loginScreen = document.getElementById("login-screen");
  const adminPanel = document.getElementById("admin-panel");
  const loginForm = document.getElementById("login-form");
  const loginMessage = document.getElementById("login-message");
  const loginButton = document.getElementById("login-btn");
  const logoutButton = document.getElementById("logout-btn");
  const forgotPasswordButton = document.getElementById("forgot-password-btn");
  const resetPasswordForm = document.getElementById("reset-password-form");
  const resetPasswordMessage = document.getElementById("reset-password-message");
  const resetPasswordButton = document.getElementById("reset-password-btn");

  const productForm = document.getElementById("product-form");
  const productMessage = document.getElementById("product-message");
  const productsTableBody = document.getElementById("products-table-body");
  const productsCount = document.getElementById("products-count");
  const ordersTableBody = document.getElementById("orders-table-body");
  const ordersMessage = document.getElementById("orders-message");
  const todaySales = document.getElementById("today-sales");
  const ordersCount = document.getElementById("orders-count");
  const newOrdersCount = document.getElementById("new-orders-count");

  const productId = document.getElementById("product-id");
  const productName = document.getElementById("product-name");
  const productNameEn = document.getElementById("product-name-en");
  const productCategory = document.getElementById("product-category");
  const productPrice = document.getElementById("product-price");
  const productDescription = document.getElementById("product-description");
  const productImage = document.getElementById("product-image");
  const productAvailable = document.getElementById("product-available");

  const saveProductButton = document.getElementById("save-product-btn");
  const cancelEditButton = document.getElementById("cancel-edit-btn");

  const categoryNames = {
    coffee: "قهوه",
    cold: "نوشیدنی سرد",
    special: "نوشیدنی ویژه",
    dessert: "دسر",
    food: "غذا"
  };

  let products = [];

  // نمایش صفحه ورود
  function showLogin(message = "") {
    loginScreen.hidden = false;
    adminPanel.hidden = true;
    loginMessage.textContent = message;
  }

  // نمایش پیام محصولات
  function showProductMessage(message, isError = false) {
    productMessage.textContent = message;
    productMessage.style.color = isError ? "#d9534f" : "#2e9d62";
  }

  // پاک کردن فرم
  function resetProductForm() {
    productForm.reset();
    productId.value = "";
    saveProductButton.textContent = "ذخیره محصول";
    cancelEditButton.hidden = true;
    showProductMessage("");
  }

  // بررسی مدیر بودن کاربر
  async function checkAdmin() {
    const {
      data: { user },
      error
    } = await supabaseClient.auth.getUser();

    if (error || !user) {
      showLogin();
      return false;
    }

    const { data: profile, error: profileError } =
      await supabaseClient
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

    if (profileError || !profile || profile.role !== "admin") {
      await supabaseClient.auth.signOut();
      showLogin("شما اجازه دسترسی به پنل مدیریت را ندارید.");
      return false;
    }

    loginScreen.hidden = true;
    adminPanel.hidden = false;

    document.getElementById("admin-name").textContent =
      profile.full_name || "TALOM Admin";

    document.getElementById("current-date").textContent =
      new Date().toLocaleDateString("fa-IR");

    await loadProducts();
    await loadOrders();
    await loadDashboardStats();

    return true;
  }

  // دریافت محصولات از Supabase
  async function loadProducts() {
    productsTableBody.textContent = "در حال دریافت محصولات...";

    const { data, error } = await supabaseClient
      .from("products")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Products loading error:", error);

      productsTableBody.textContent = "خطا در دریافت محصولات.";
      showProductMessage(
        "دریافت محصولات ناموفق بود. دسترسی دیتابیس را بررسی کنید.",
        true
      );

      return;
    }

    products = data || [];

    renderProducts();
  }

  // آمار زنده داشبورد
  async function loadDashboardStats() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayIso = startOfDay.toISOString();

    const [allOrders, pendingOrders, completedToday] = await Promise.all([
      supabaseClient.from("orders").select("id", { count: "exact", head: true }),
      supabaseClient.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabaseClient.from("orders").select("total").eq("status", "completed").gte("created_at", todayIso)
    ]);

    if (allOrders.error || pendingOrders.error || completedToday.error) {
      console.error("Dashboard stats error:", allOrders.error || pendingOrders.error || completedToday.error);
      return;
    }

    ordersCount.textContent = Number(allOrders.count || 0).toLocaleString("fa-IR");
    newOrdersCount.textContent = Number(pendingOrders.count || 0).toLocaleString("fa-IR");
    const sales = (completedToday.data || []).reduce((sum, order) => sum + Number(order.total || 0), 0);
    todaySales.textContent = sales.toLocaleString("fa-IR") + " تومان";
  }

  // دریافت سفارش‌ها فقط برای مدیر
  async function loadOrders() {
    if (!ordersTableBody) return;
    ordersTableBody.textContent = "در حال دریافت سفارش‌ها...";

    const { data, error } = await supabaseClient
      .from("orders")
      .select("id, customer_name, phone, address, total, status, created_at, order_items(product_name, quantity)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Orders loading error:", error);
      ordersTableBody.textContent = "دریافت سفارش‌ها ناموفق بود.";
      ordersMessage.textContent = "خطا در دریافت سفارش‌ها.";
      return;
    }

    ordersTableBody.replaceChildren();
    ordersMessage.textContent = data.length
      ? data.length.toLocaleString("fa-IR") + " سفارش اخیر"
      : "هنوز سفارشی ثبت نشده است.";

    if (!data.length) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 8;
      cell.textContent = "هنوز سفارشی ثبت نشده است.";
      row.appendChild(cell);
      ordersTableBody.appendChild(row);
      return;
    }

    const statusLabels = {
      pending: "در انتظار بررسی",
      confirmed: "تأیید شده",
      preparing: "در حال آماده‌سازی",
      completed: "تکمیل شده",
      cancelled: "لغو شده"
    };

    data.forEach((order) => {
      const row = document.createElement("tr");
      const values = [
        String(order.id).slice(0, 8),
        order.customer_name || "-",
        order.phone || "-",
        order.address || "-",
        Number(order.total || 0).toLocaleString("fa-IR") + " تومان",
        (order.order_items || []).map(item =>
          (item.product_name || "محصول") + " × " + item.quantity
        ).join("، ") || "-",
        order.created_at
          ? new Date(order.created_at).toLocaleString("fa-IR")
          : "-"
      ];

      values.forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

      const statusCell = document.createElement("td");
      const statusSelect = document.createElement("select");
      statusSelect.setAttribute("aria-label", "وضعیت سفارش " + String(order.id).slice(0, 8));

      Object.entries(statusLabels).forEach(([value, label]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        statusSelect.appendChild(option);
      });

      statusSelect.value = order.status;
      statusSelect.addEventListener("change", async () => {
        statusSelect.disabled = true;
        const { error: updateError } = await supabaseClient
          .from("orders")
          .update({ status: statusSelect.value })
          .eq("id", order.id);

        if (updateError) {
          console.error("Order status update error:", updateError);
          statusSelect.value = order.status;
          ordersMessage.textContent = "تغییر وضعیت سفارش ذخیره نشد.";
        } else {
          order.status = statusSelect.value;
          ordersMessage.textContent = "وضعیت سفارش به‌روزرسانی شد.";
          await loadDashboardStats();
        }
        statusSelect.disabled = false;
      });

      statusCell.appendChild(statusSelect);
      row.appendChild(statusCell);
      ordersTableBody.appendChild(row);
    });
  }

  // ساخت جدول محصولات
  function renderProducts() {
    productsTableBody.replaceChildren();

    productsCount.textContent = products.length.toLocaleString("fa-IR");

    if (products.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");

      cell.colSpan = 6;
      cell.textContent = "محصولی ثبت نشده است.";

      row.appendChild(cell);
      productsTableBody.appendChild(row);

      return;
    }

    products.forEach((product) => {
      const row = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.textContent = product.id;

      const nameCell = document.createElement("td");
      nameCell.textContent = product.name || "";

      const categoryCell = document.createElement("td");
      categoryCell.textContent =
        categoryNames[product.category] || product.category || "-";

      const priceCell = document.createElement("td");
      priceCell.textContent =
        Number(product.price || 0).toLocaleString("fa-IR") + " تومان";

      const statusCell = document.createElement("td");
      statusCell.textContent = product.is_available ? "موجود" : "ناموجود";

      const actionCell = document.createElement("td");

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.textContent = "ویرایش";
      editButton.className = "primary-btn";

      editButton.addEventListener("click", () => {
        editProduct(product.id);
      });

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.textContent = "حذف";
      deleteButton.className = "danger-btn";

      deleteButton.addEventListener("click", () => {
        deleteProduct(product.id);
      });

      actionCell.append(editButton, deleteButton);

      row.append(
        idCell,
        nameCell,
        categoryCell,
        priceCell,
        statusCell,
        actionCell
      );

      productsTableBody.appendChild(row);
    });
  }

  // افزودن یا ویرایش محصول
  productForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    saveProductButton.disabled = true;
    saveProductButton.textContent = "در حال ذخیره...";

    try {
      const price = Number(productPrice.value);

      if (!Number.isFinite(price) || price < 0) {
        showProductMessage("قیمت واردشده معتبر نیست.", true);
        return;
      }

      const productData = {
        name: productName.value.trim(),
        name_en: productNameEn.value.trim() || null,
        category: productCategory.value,
        price,
        description: productDescription.value.trim(),
        image_url: productImage.value.trim() || null,
        is_available: productAvailable.value === "true"
      };

      if (!productData.name) {
        showProductMessage("نام محصول را وارد کنید.", true);
        return;
      }

      let result;

      if (productId.value) {
        result = await supabaseClient
          .from("products")
          .update(productData)
          .eq("id", productId.value);
      } else {
        result = await supabaseClient
          .from("products")
          .insert(productData);
      }

      if (result.error) {
        throw result.error;
      }

      showProductMessage(
        productId.value
          ? "محصول با موفقیت ویرایش شد."
          : "محصول جدید با موفقیت اضافه شد."
      );

      resetProductForm();
      await loadProducts();

    } catch (error) {
      console.error("Product save error:", error);

      showProductMessage(
        "ذخیره محصول انجام نشد. دسترسی‌ها و اطلاعات را بررسی کنید.",
        true
      );

    } finally {
      saveProductButton.disabled = false;
      saveProductButton.textContent = productId.value
        ? "ذخیره تغییرات"
        : "ذخیره محصول";
    }
  });

  // آماده‌سازی فرم ویرایش
  function editProduct(id) {
    const product = products.find((item) => item.id === id);

    if (!product) return;

    productId.value = product.id;
    productName.value = product.name || "";
    productNameEn.value = product.name_en || "";
    productCategory.value = product.category || "coffee";
    productPrice.value = product.price || 0;
    productDescription.value = product.description || "";
    productImage.value = product.image_url || "";
    productAvailable.value = String(product.is_available);

    saveProductButton.textContent = "ذخیره تغییرات";
    cancelEditButton.hidden = false;

    document.getElementById("products").scrollIntoView({
      behavior: "smooth"
    });

    showProductMessage("در حال ویرایش محصول: " + product.name);
  }

  // لغو ویرایش
  cancelEditButton.addEventListener("click", () => {
    resetProductForm();
  });

  // حذف محصول
  async function deleteProduct(id) {
    const product = products.find((item) => item.id === id);

    if (!product) return;

    const confirmed = window.confirm(
      `آیا از حذف محصول «${product.name}» مطمئن هستید؟`
    );

    if (!confirmed) return;

    try {
      const { error } = await supabaseClient
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;

      showProductMessage("محصول با موفقیت حذف شد.");

      await loadProducts();

    } catch (error) {
      console.error("Product delete error:", error);

      showProductMessage(
        "حذف محصول انجام نشد. دسترسی مدیر را بررسی کنید.",
        true
      );
    }
  }

  // ورود به حساب
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    loginButton.disabled = true;
    loginButton.textContent = "در حال ورود...";
    loginMessage.textContent = "";

    try {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        showLogin("ایمیل یا رمز عبور اشتباه است.");
        return;
      }

      await checkAdmin();

    } catch (error) {
      console.error(error);
      showLogin("خطا در اتصال. دوباره تلاش کنید.");

    } finally {
      loginButton.disabled = false;
      loginButton.textContent = "ورود به پنل";
    }
  });

  // خروج از حساب
  logoutButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      showLogin("خطا در خروج از حساب.");
      return;
    }

    showLogin("از حساب خود خارج شدید.");
  });

  // تازه‌سازی دستی سفارش‌ها و آمار داشبورد
  document.getElementById("refresh-orders").addEventListener("click", async () => {
    const refreshButton = document.getElementById("refresh-orders");
    refreshButton.disabled = true;
    refreshButton.textContent = "در حال به‌روزرسانی...";
    try {
      await Promise.all([loadOrders(), loadDashboardStats()]);
      if (!ordersMessage.textContent.startsWith("خطا")) {
        ordersMessage.textContent = "سفارش‌ها و آمار به‌روز شدند.";
      }
    } finally {
      refreshButton.disabled = false;
      refreshButton.textContent = "به‌روزرسانی سفارش‌ها";
    }
  });

  // درخواست لینک بازیابی رمز عبور از طریق ایمیل مدیر
  forgotPasswordButton.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    if (!email) {
      loginMessage.textContent = "ابتدا ایمیل مدیر را وارد کنید.";
      return;
    }

    forgotPasswordButton.disabled = true;
    loginMessage.textContent = "در حال ارسال لینک بازیابی...";
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname
      });
      if (error) throw error;
      loginMessage.textContent = "اگر این ایمیل در سامانه ثبت شده باشد، لینک بازیابی برای آن ارسال می‌شود. صندوق ورودی و پوشه Spam را بررسی کنید.";
    } catch (error) {
      console.error("Password recovery error:", error);
      loginMessage.textContent = "ارسال لینک بازیابی انجام نشد. تنظیمات ایمیل Supabase را بررسی کنید.";
    } finally {
      forgotPasswordButton.disabled = false;
    }
  });

  // ثبت رمز جدید پس از باز کردن لینک بازیابی
  resetPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const password = document.getElementById("new-password").value;
    const confirmation = document.getElementById("confirm-password").value;

    if (password.length < 8) {
      resetPasswordMessage.textContent = "رمز عبور باید حداقل ۸ کاراکتر باشد.";
      return;
    }
    if (password !== confirmation) {
      resetPasswordMessage.textContent = "تکرار رمز عبور مطابقت ندارد.";
      return;
    }

    resetPasswordButton.disabled = true;
    resetPasswordMessage.textContent = "در حال ذخیره رمز جدید...";
    try {
      const { error } = await supabaseClient.auth.updateUser({ password });
      if (error) throw error;
      await supabaseClient.auth.signOut();
      resetPasswordForm.hidden = true;
      loginForm.hidden = false;
      resetPasswordForm.reset();
      loginMessage.textContent = "رمز عبور با موفقیت تغییر کرد. اکنون با رمز جدید وارد شوید.";
    } catch (error) {
      console.error("Password update error:", error);
      resetPasswordMessage.textContent = "تغییر رمز انجام نشد. لینک بازیابی ممکن است منقضی شده باشد.";
    } finally {
      resetPasswordButton.disabled = false;
    }
  });

  // دریافت رویداد لینک بازیابی و نمایش فرم رمز جدید
  supabaseClient.auth.onAuthStateChange((event) => {
    if (event === "PASSWORD_RECOVERY") {
      loginScreen.hidden = false;
      adminPanel.hidden = true;
      loginForm.hidden = true;
      resetPasswordForm.hidden = false;
      loginMessage.textContent = "";
    } else if (event === "SIGNED_OUT") {
      resetPasswordForm.hidden = true;
      loginForm.hidden = false;
      showLogin();
    }
  });

  // بررسی وضعیت ورود هنگام باز شدن صفحه
  try {
    await checkAdmin();
  } catch (error) {
    console.error(error);
    showLogin("خطا در اتصال به سرور.");
  }
});

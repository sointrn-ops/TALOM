"use strict";

const SUPABASE_URL = "https://rlecvkrrdxqjepsxylee.supabase.co";
const SUPABASE_KEY = "sb_publishable__TOW24x67zjRnlas6Lb0xg_1wF0tC1g";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener("DOMContentLoaded", async () => {
  const authCard = document.getElementById("auth-card");
  const accountCard = document.getElementById("account-card");
  const form = document.getElementById("auth-form");
  const message = document.getElementById("auth-message");
  const title = document.getElementById("form-title");
  const intro = document.getElementById("form-intro");
  const nameField = document.getElementById("name-field");
  const confirmField = document.getElementById("confirm-field");
  const passwordField = document.getElementById("password-field");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm-password");
  const submit = document.getElementById("submit-button");
  const toggleSignup = document.getElementById("toggle-signup");
  const forgot = document.getElementById("forgot-password");
  const ordersList = document.getElementById("orders-list");
  const ordersMessage = document.getElementById("orders-message");
  let mode = "login";

  function showMessage(text, isError = false) {
    message.textContent = text;
    message.dataset.error = String(isError);
  }

  function setMode(nextMode) {
    mode = nextMode;
    const signup = mode === "signup";
    const recovery = mode === "recovery";
    title.textContent = signup ? "ساخت حساب TALOM" : recovery ? "بازیابی رمز عبور" : "ورود به حساب";
    intro.textContent = signup ? "برای ساخت حساب، اطلاعات زیر را وارد کنید." : recovery ? "لینک بازیابی برای ایمیل شما ارسال می‌شود." : "برای مشاهده حساب و سفارش‌ها وارد شوید.";
    nameField.hidden = !signup;
    confirmField.hidden = !signup;
    passwordField.hidden = recovery;
    password.required = !recovery;
    confirmPassword.required = signup;
    submit.textContent = signup ? "ثبت‌نام" : recovery ? "ارسال لینک بازیابی" : "ورود";
    toggleSignup.hidden = recovery;
    forgot.hidden = signup || recovery;
    toggleSignup.textContent = signup ? "قبلاً حساب ساخته‌ام؛ ورود" : "ساخت حساب جدید";
    showMessage("");
  }

  async function showAccount(user) {
    authCard.hidden = true;
    accountCard.hidden = false;
    document.getElementById("user-email").textContent = user.email || "";
    await loadOrders(user.id);
  }

  async function loadOrders(userId) {
    ordersList.replaceChildren();
    ordersMessage.textContent = "در حال دریافت سفارش‌ها...";
    const { data, error } = await supabaseClient
      .from("orders")
      .select("id, total, status, created_at, order_items(product_name, quantity, unit_price)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Account orders error:", error);
      ordersMessage.textContent = "دریافت سفارش‌ها انجام نشد.";
      return;
    }

    if (!data.length) {
      ordersMessage.textContent = "هنوز سفارشی برای حساب شما ثبت نشده است.";
      return;
    }

    const statuses = {
      pending: "در انتظار بررسی",
      confirmed: "تأیید شده",
      preparing: "در حال آماده‌سازی",
      completed: "تکمیل شده",
      cancelled: "لغو شده"
    };

    ordersMessage.textContent = data.length.toLocaleString("fa-IR") + " سفارش";
    data.forEach(order => {
      const card = document.createElement("article");
      card.className = "order-card";
      const head = document.createElement("div");
      head.className = "order-head";
      const code = document.createElement("strong");
      code.textContent = "سفارش " + String(order.id).slice(0, 8);
      const status = document.createElement("span");
      status.textContent = statuses[order.status] || order.status;
      head.append(code, status);
      const date = document.createElement("p");
      date.textContent = new Date(order.created_at).toLocaleString("fa-IR");
      const items = document.createElement("p");
      items.textContent = (order.order_items || []).map(item => (item.product_name || "محصول") + " × " + item.quantity).join("، ");
      const total = document.createElement("strong");
      total.textContent = Number(order.total).toLocaleString("fa-IR") + " تومان";
      card.append(head, date, items, total);
      ordersList.appendChild(card);
    });
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    submit.disabled = true;
    showMessage("");
    try {
      const email = document.getElementById("email").value.trim();
      if (mode === "recovery") {
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + window.location.pathname
        });
        if (error) throw error;
        showMessage("اگر این ایمیل ثبت شده باشد، لینک بازیابی برای آن ارسال می‌شود.");
      } else if (mode === "signup") {
        const fullName = document.getElementById("full-name").value.trim();
        if (fullName.length < 2) throw new Error("نام خود را کامل وارد کنید.");
        if (password.value.length < 8) throw new Error("رمز عبور باید حداقل ۸ نویسه باشد.");
        if (password.value !== confirmPassword.value) throw new Error("تکرار رمز عبور مطابقت ندارد.");
        const { data, error } = await supabaseClient.auth.signUp({
          email,
          password: password.value,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin + window.location.pathname
          }
        });
        if (error) throw error;
        if (data.session) {
          await showAccount(data.user);
        } else {
          showMessage("ثبت‌نام انجام شد. ایمیل خود را برای تأیید حساب بررسی کنید.");
        }
      } else {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password: password.value });
        if (error) throw error;
        await showAccount(data.user);
      }
    } catch (error) {
      console.error("Auth error:", error);
      showMessage(error.message || "عملیات انجام نشد. دوباره تلاش کنید.", true);
    } finally {
      submit.disabled = false;
    }
  });

  toggleSignup.addEventListener("click", () => setMode(mode === "signup" ? "login" : "signup"));
  forgot.addEventListener("click", () => setMode("recovery"));

  document.getElementById("logout-button").addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      ordersMessage.textContent = "خروج از حساب انجام نشد.";
      return;
    }
    accountCard.hidden = true;
    authCard.hidden = false;
    form.reset();
    setMode("login");
  });

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") setMode("recovery");
    if (event === "SIGNED_OUT") {
      accountCard.hidden = true;
      authCard.hidden = false;
    }
  });

  const { data: { session }, error } = await supabaseClient.auth.getSession();
  if (error) {
    showMessage("بررسی نشست ورود ناموفق بود.", true);
    return;
  }
  if (session?.user) await showAccount(session.user);
});

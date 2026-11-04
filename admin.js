
const SUPABASE_URL = "https://rlecvkrrdxqjepsxylee.supabase.co";
const SUPABASE_KEY = "sb_publishable__TOW24x67zjRnlas6Lb0xg_1wF0tC1g";

// اتصال به Supabase
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

  // نمایش صفحه ورود
  function showLogin(message = "") {
    loginScreen.hidden = false;
    adminPanel.hidden = true;
    loginMessage.textContent = message;
  }

  // بررسی مدیر بودن کاربر
  async function checkAdmin() {
    const {
      data: { user },
      error
    } = await supabaseClient.auth.getUser();

    if (error || !user) {
      showLogin();
      return;
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
      return;
    }

    loginScreen.hidden = true;
    adminPanel.hidden = false;

    document.getElementById("admin-name").textContent =
      profile.full_name || "TALOM Admin";

    document.getElementById("current-date").textContent =
      new Date().toLocaleDateString("fa-IR");
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
      showLogin("خطا در اتصال. دوباره تلاش کنید.");
      console.error(error);

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

  // بررسی وضعیت ورود هنگام باز شدن صفحه
  try {
    await checkAdmin();
  } catch (error) {
    console.error(error);
    showLogin("خطا در اتصال به سرور.");
  }
});

// بررسی اتصال Supabase
const SUPABASE_URL = "https://rlecvkrrdxqjepsxylee.supabase.co";

// کلید عمومی (Publishable / anon) پروژه را بعداً اینجا قرار می‌دهیم.
const SUPABASE_KEY = "";

// وضعیت پنل
document.addEventListener("DOMContentLoaded", () => {
  console.log("TALOM Admin Panel loaded");

  // نمایش تاریخ امروز
  const dateElement = document.getElementById("current-date");

  if (dateElement) {
    dateElement.textContent = new Date().toLocaleDateString("fa-IR");
  }

  // خروج از حساب
  const logoutButton = document.getElementById("logout-btn");

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      if (window.talomSupabase) {
        await window.talomSupabase.auth.signOut();
      }

      window.location.reload();
    });
  }
});

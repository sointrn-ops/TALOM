(function () {
  "use strict";

  const KEY = "talom-cart";
  const cart = readCart();
  const modal = document.getElementById("cartModal");
  const list = document.getElementById("cartItems");
  const empty = document.getElementById("cartEmpty");
  const total = document.getElementById("cartTotal");
  const form = document.getElementById("checkoutForm");
  const message = document.getElementById("checkoutMessage");
  const submit = document.getElementById("checkoutSubmit");

  function readCart() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || "{}");
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch {
      return {};
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(cart));
    } catch (error) {
      console.warn("TALOM cart storage unavailable", error);
    }
  }

  function entries() {
    return Object.entries(cart).filter(([, item]) =>
      item && Number.isInteger(item.qty) && item.qty > 0
    );
  }

  function count() {
    return entries().reduce((sum, [, item]) => sum + item.qty, 0);
  }

  function updateCount() {
    const badge = document.getElementById("cartCount");
    if (badge) badge.textContent = String(count());
  }

  function setMessage(text, kind) {
    if (!message) return;
    message.textContent = text;
    message.dataset.kind = kind || "";
  }

  function render() {
    if (!list || !empty) return;
    list.replaceChildren();
    const items = entries();
    empty.hidden = items.length > 0;
    let amount = 0;

    items.forEach(([id, item]) => {
      const row = document.createElement("div");
      row.className = "cart-line";

      const info = document.createElement("span");
      info.textContent = item.name + " × " + item.qty + " — " + item.priceLabel;
      row.appendChild(info);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "حذف";
      remove.dataset.cartRemove = id;
      row.appendChild(remove);
      list.appendChild(row);

      amount += (Number(item.price) || 0) * item.qty;
    });

    if (total) total.textContent = new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
    updateCount();
  }

  function openCart() {
    if (!modal) return;
    if (typeof window.talomOpenModal === "function") window.talomOpenModal(modal);
    else {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    render();
    setMessage("", "");
  }

  document.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const add = target.closest("[data-cart-add]");
    if (add) {
      const id = add.dataset.cartAdd;
      if (!id) return;
      const next = (Number(cart[id]?.qty) || 0) + 1;
      if (next > 10) {
        window.alert("حداکثر تعداد هر محصول ۱۰ عدد است.");
        return;
      }

      const card = add.closest(".product-card");
      const name = card?.querySelector(".product-name")?.textContent || "TALOM";
      const priceLabel = card?.querySelector(".product-price")?.textContent || "";
      const price = Number(add.dataset.cartPrice) || 0;
      cart[id] = { qty: next, name, price, priceLabel };
      save();
      render();
      add.textContent = "اضافه شد";
      window.setTimeout(() => {
        add.textContent = document.documentElement.lang === "en" ? "Add to bag +" : "افزودن به سبد خرید +";
      }, 1200);
      return;
    }

    if (target.closest("#cartOpenButton")) {
      openCart();
      return;
    }

    const close = target.closest("[data-cart-close]");
    if (close) {
      if (typeof window.talomCloseModal === "function") window.talomCloseModal(modal);
      else {
        modal?.classList.remove("open");
        modal?.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
      }
      return;
    }

    const remove = target.closest("[data-cart-remove]");
    if (remove) {
      delete cart[remove.dataset.cartRemove];
      save();
      render();
      setMessage("", "");
    }
  });

  form?.addEventListener("submit", async event => {
    event.preventDefault();
    if (submit?.disabled) return;

    const items = entries().map(([productId, item]) => ({
      product_id: productId,
      quantity: item.qty
    }));

    if (!items.length) {
      setMessage("سبد خرید خالی است.", "error");
      return;
    }

    const client = window.talomAuthClient;
    if (!client) {
      setMessage("سامانه حساب کاربری در دسترس نیست. صفحه را تازه‌سازی کنید.", "error");
      return;
    }

    submit.disabled = true;
    submit.textContent = "در حال ثبت سفارش...";
    setMessage("در حال بررسی حساب و ثبت سفارش...", "");

    try {
      const { data: sessionData, error: sessionError } = await client.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData?.session) {
        setMessage("برای ثبت سفارش ابتدا وارد حساب کاربری شوید.", "error");
        const authButton = document.getElementById("authOpenButton");
        if (authButton) authButton.click();
        return;
      }

      const name = document.getElementById("checkoutName").value.trim();
      const phone = document.getElementById("checkoutPhone").value.trim();
      const address = document.getElementById("checkoutAddress").value.trim();

      const { data: orderId, error } = await client.rpc("create_store_order", {
        p_customer_name: name,
        p_phone: phone,
        p_address: address || null,
        p_items: items
      });
      if (error) throw error;
      if (!orderId) throw new Error("Order ID was not returned.");

      Object.keys(cart).forEach(id => delete cart[id]);
      save();
      render();
      form.reset();
      setMessage("سفارش با موفقیت ثبت شد. کد پیگیری: " + orderId + " — وضعیت: در انتظار تأیید کافه. پرداخت آنلاین هنوز فعال نیست.", "success");
    } catch (error) {
      console.error("TALOM order submission error:", error);
      const text = String(error?.message || "");
      const friendly = /محصول|موجود|سبد خرید|تعداد|نام|شماره|وارد حساب/i.test(text)
        ? text
        : "ثبت سفارش انجام نشد. اتصال اینترنت و اطلاعات واردشده را بررسی کنید.";
      setMessage(friendly, "error");
    } finally {
      submit.disabled = false;
      submit.textContent = "ثبت سفارش";
    }
  });

  updateCount();
  render();
})();
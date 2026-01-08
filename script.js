/* =========================
   Helpers
   ========================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* =========================
   Drawer (Mobile Menu)
   ========================= */
const openDrawerBtn = $("#openDrawer");
const closeDrawerBtn = $("#closeDrawer");
const drawer = $("#mobileDrawer");
const drawerBackdrop = $("#drawerBackdrop");

function setBodyLock(locked) {
  document.documentElement.style.overflow = locked ? "hidden" : "";
  document.body.style.overflow = locked ? "hidden" : "";
}

function openDrawer() {
  if (!drawer || !drawerBackdrop || !openDrawerBtn) return;
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  drawerBackdrop.hidden = false;
  openDrawerBtn.setAttribute("aria-expanded", "true");
  setBodyLock(true);
}

function closeDrawer() {
  if (!drawer || !drawerBackdrop || !openDrawerBtn) return;
  drawer.classList.remove("is-open");
  drawer.setAttribute("aria-hidden", "true");
  drawerBackdrop.hidden = true;
  openDrawerBtn.setAttribute("aria-expanded", "false");
  setBodyLock(false);
}

openDrawerBtn?.addEventListener("click", () => {
  const isOpen = drawer?.classList.contains("is-open");
  if (isOpen) closeDrawer();
  else openDrawer();
});

closeDrawerBtn?.addEventListener("click", closeDrawer);
drawerBackdrop?.addEventListener("click", closeDrawer);

// Close drawer on any drawer link click
$$(".drawer a").forEach((a) => a.addEventListener("click", closeDrawer));

/* =========================
   Smooth scroll (with navbar offset)
   ========================= */
(function () {
  const navbar = $(".navbar");

  function getOffset() {
    return (navbar?.getBoundingClientRect().height || 0) + 16;
  }

  function scrollToHash(hash) {
    const el = document.querySelector(hash);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - getOffset();
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      // allow normal click for details/summary etc? but for anchors we smooth scroll
      e.preventDefault();
      history.pushState(null, "", href);
      closeAllDropdowns();
      scrollToHash(href);
    });
  });

  window.addEventListener("load", () => {
    if (location.hash) scrollToHash(location.hash);
  });
})();

/* =========================
   Dropdowns
   ========================= */
const dropdowns = $$(".dropdown");

function closeAllDropdowns() {
  dropdowns.forEach((dd) => {
    dd.setAttribute("aria-expanded", "false");
    const btn = dd.querySelector("[data-dd]");
    if (btn) btn.setAttribute("aria-expanded", "false");
  });
}

dropdowns.forEach((dd) => {
  const btn = dd.querySelector("[data-dd]");
  btn?.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dd.getAttribute("aria-expanded") === "true";
    closeAllDropdowns();
    dd.setAttribute("aria-expanded", String(!isOpen));
    btn.setAttribute("aria-expanded", String(!isOpen));
  });
});

document.addEventListener("click", () => {
  closeAllDropdowns();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAllDropdowns();
    closeDrawer();
  }
});

/* =========================
   Prefill category (from CTA / dropdown links)
   ========================= */
function prefillCategory(value) {
  const sel = $("#category");
  if (!sel) return;
  const options = Array.from(sel.options).map((o) => o.text);
  sel.value = options.includes(value) ? value : "Other";
}

$$("[data-prefill]").forEach((el) => {
  el.addEventListener("click", () => {
    prefillCategory(el.getAttribute("data-prefill"));
  });
});

/* =========================
   Form Finder demo generator
   ========================= */
$("#genSteps")?.addEventListener("click", () => {
  const cat = $("#category")?.value || "Form";
  const state = $("#state")?.value?.trim();
  const purpose = $("#purpose")?.value?.trim();
  const deadline = $("#deadline")?.value;

  const badge = $("#previewBadge");
  if (badge) badge.textContent = "Updated";

  const preview = $("#preview");
  if (!preview) return;

  const deadlineText = deadline ? ` • Deadline: ${deadline}` : "";
  const purposeText = purpose ? ` • Purpose: ${purpose}` : "";

  preview.innerHTML = `
    <div class="step" style="margin:0;">
      <div class="num">1</div>
      <div>
        <div style="font-weight:820;">Confirm portal: ${cat}${state ? " • " + state : ""}${deadlineText}</div>
        <div class="hint" style="margin:6px 0 0;">Verify official variant before payment. Avoid agents asking for OTP.</div>
      </div>
    </div>

    <div class="step" style="margin:0;">
      <div class="num">2</div>
      <div>
        <div style="font-weight:820;">Prepare uploads${purposeText}</div>
        <div class="hint" style="margin:6px 0 0;">Photo/sign format, file size, and DOB/name match.</div>
      </div>
    </div>

    <div class="step" style="margin:0;">
      <div class="num">3</div>
      <div>
        <div style="font-weight:820;">Submit + save proof</div>
        <div class="hint" style="margin:6px 0 0;">Save receipt + acknowledgement PDF for tracking.</div>
      </div>
    </div>
  `;

  const hint = $("#stepsHint");
  if (hint) hint.textContent = "Preview updated. Final steps can vary by the official portal.";
});

/* =========================
   Track request (demo)
   ========================= */
$("#trackBtn")?.addEventListener("click", () => {
  const id = $("#orderId")?.value?.trim();
  const out = $("#trackResult");
  if (!out) return;

  if (!id) {
    out.textContent = "Enter Request ID.";
    return;
  }

  // demo statuses
  const statuses = ["In review", "Awaiting documents", "Submitted", "Completed"];
  const idx = Math.min(id.length % statuses.length, statuses.length - 1);
  out.textContent = `Request ${id}: ${statuses[idx]} (demo).`;
});

/* =========================
   Support form (demo)
   ========================= */
$("#sendMsg")?.addEventListener("click", () => {
  const name = $("#msgName")?.value?.trim() || "there";
  const msg = $("#msgText")?.value?.trim();
  const out = $("#msgResult");
  if (!out) return;

  if (!msg) {
    out.textContent = "Please enter a message.";
    return;
  }

  out.textContent = `Thanks, ${name}! Message received (demo). Replace this with WhatsApp/Email integration.`;
});

$("#clearMsg")?.addEventListener("click", () => {
  const n = $("#msgName");
  const t = $("#msgText");
  const out = $("#msgResult");
  if (n) n.value = "";
  if (t) t.value = "";
  if (out) out.textContent = "";
});

/* =========================
   Pricing CTA (demo)
   ========================= */
$("#choosePlus")?.addEventListener("click", () => {
  alert("Choose Plus: integrate this button with your payment system. (Demo)");
});

/* =========================
   Language toggle
   ========================= */
function setLang(lang) {
  const en = lang === "EN";

  $("#langEN")?.setAttribute("aria-pressed", en ? "true" : "false");
  $("#langHI")?.setAttribute("aria-pressed", en ? "false" : "true");

  const kicker = $("#kickerText");
  const headline = $("#headline");
  const subtitle = $("#subtitle");

  if (kicker) {
    kicker.textContent = en
      ? "Find the right form. Submit with confidence."
      : "सही फॉर्म चुनें। भरोसे के साथ सबमिट करें।";
  }

  if (headline) {
    headline.textContent = en
      ? "Premium assistance for every important form."
      : "हर ज़रूरी फॉर्म के लिए प्रीमियम सहायता।";
  }

  if (subtitle) {
    subtitle.textContent = en
      ? "Use the Form Finder + checklist to avoid mistakes. If you want, get guided help and track your request end-to-end."
      : "गलतियों से बचने के लिए Form Finder और checklist इस्तेमाल करें। चाहें तो guided help लें और request को end-to-end track करें।";
  }
}

$("#langEN")?.addEventListener("click", () => setLang("EN"));
$("#langHI")?.addEventListener("click", () => setLang("HI"));

/* =========================
   Footer year
   ========================= */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

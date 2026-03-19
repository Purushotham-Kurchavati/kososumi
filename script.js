const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const $ = (sel, root = document) => root.querySelector(sel);

const prefersReducedMotion = window.matchMedia?.(
  "(prefers-reduced-motion: reduce)"
).matches;

function setupReveal() {
  const els = $$(".reveal");
  if (!els.length) return;

  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.16, rootMargin: "80px 0px -40px 0px" }
  );

  els.forEach((el) => io.observe(el));
}

function setupSmoothAnchors() {
  const links = $$('a[href^="#"]');
  if (!links.length) return;

  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });

      const mobile = $(".nav__mobile");
      if (mobile && !mobile.hidden) toggleMobileMenu(false);
    });
  });
}

function toggleMobileMenu(forceOpen) {
  const burger = $(".nav__burger");
  const mobile = $(".nav__mobile");
  if (!burger || !mobile) return;

  const shouldOpen =
    typeof forceOpen === "boolean" ? forceOpen : mobile.hidden === true;

  mobile.hidden = !shouldOpen;
  burger.setAttribute("aria-label", shouldOpen ? "Close menu" : "Open menu");
  burger.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
}

function setupMobileMenu() {
  const burger = $(".nav__burger");
  const mobile = $(".nav__mobile");
  if (!burger || !mobile) return;

  burger.setAttribute("aria-expanded", "false");
  burger.addEventListener("click", () => toggleMobileMenu());

  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth > 640 && mobile && !mobile.hidden) {
        toggleMobileMenu(false);
      }
    },
    { passive: true }
  );

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobile && !mobile.hidden) toggleMobileMenu(false);
  });
}

function setupBackgroundParallax() {
  if (prefersReducedMotion) return;
  const glow = $(".bg__glow");
  if (!glow) return;

  let raf = 0;
  const update = (x, y) => {
    glow.style.setProperty("--mx", `${x}%`);
    glow.style.setProperty("--my", `${y}%`);
  };

  const onMove = (ev) => {
    const w = window.innerWidth || 1;
    const h = window.innerHeight || 1;
    const x = Math.max(0, Math.min(1, ev.clientX / w));
    const y = Math.max(0, Math.min(1, ev.clientY / h));
    const mx = 35 + x * 30;
    const my = 22 + y * 34;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => update(mx, my));
  };

  window.addEventListener("pointermove", onMove, { passive: true });
}

function setupActiveNav() {
  const nav = $(".nav");
  const links = $$(".nav__link").filter((a) =>
    (a.getAttribute("href") || "").startsWith("#")
  );
  if (!nav || !links.length) return;

  const sections = links
    .map((a) => {
      const id = (a.getAttribute("href") || "").slice(1);
      return { a, el: document.getElementById(id) };
    })
    .filter((x) => x.el);

  const setActive = (id) => {
    links.forEach((a) =>
      a.classList.toggle(
        "is-active",
        (a.getAttribute("href") || "") === `#${id}`
      )
    );
  };

  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    setActive("home");
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      const vis = entries
        .filter((e) => e.isIntersecting)
        .sort(
          (a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0)
        )[0];
      if (!vis) return;
      if (vis.target && vis.target.id) setActive(vis.target.id);
    },
    { threshold: [0.2, 0.35, 0.5, 0.7], rootMargin: "-20% 0px -60% 0px" }
  );

  sections.forEach((s) => io.observe(s.el));
}

setupReveal();
setupSmoothAnchors();
setupMobileMenu();
setupBackgroundParallax();
setupActiveNav();


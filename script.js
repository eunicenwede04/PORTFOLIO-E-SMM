document.addEventListener("DOMContentLoaded", init);

function init() {
  console.log("Javascript connected!");
  setupHeaderScroll();
  setupMobileNav();
  setupScrollSpy();
  setupToTopButton();
  setupScrollReveal();
  setupBarChartAnimation();
  setupCounters();
  setupTrendAnimations();
  setupDonutAnimation();
}

function setupHeaderScroll() {
  const header = document.getElementById("siteHeader");
  const toTop = document.getElementById("toTop");

  if (!header || !toTop) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY > 30;
    header.classList.toggle("scrolled", scrolled);
    toTop.classList.toggle("show", window.scrollY > 500);
  });
}

function setupMobileNav() {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((anchor) => {
    anchor.addEventListener("click", () => navLinks.classList.remove("open"));
  });
}

function setupScrollSpy() {
  const links = document.querySelectorAll(".nav-links a");
  const sections = Array.from(links)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((item) => item.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    { threshold: 0.4 },
  );

  sections.forEach((section) => observer.observe(section));
}

function setupToTopButton() {
  const toTop = document.getElementById("toTop");
  if (!toTop) return;

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setupScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, io) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.15 },
  );

  revealEls.forEach((el) => observer.observe(el));
}

function setupBarChartAnimation() {
  const barsChart = document.getElementById("barsChart");
  if (!barsChart || !("IntersectionObserver" in window)) return;

  const barObserver = new IntersectionObserver(
    (entries, io) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll(".bar").forEach((bar) => {
          bar.style.transform = "scaleY(1)";
        });
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.4 },
  );

  barObserver.observe(barsChart);
}

function setupCounters() {
  const counters = document.querySelectorAll("[data-target]");
  if (!counters.length || !("IntersectionObserver" in window)) return;

  const counterObserver = new IntersectionObserver(
    (entries, io) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

function setupTrendAnimations() {
  const trendEls = document.querySelectorAll(".trend[data-trend-target]");
  if (!trendEls.length || !("IntersectionObserver" in window)) return;

  const trendObserver = new IntersectionObserver(
    (entries, io) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateTrend(entry.target);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.5 },
  );

  trendEls.forEach((trend) => trendObserver.observe(trend));
}

function setupDonutAnimation() {
  const donutWrap = document.getElementById("donutChart");
  if (!donutWrap || !("IntersectionObserver" in window)) return;

  const donutObserver = new IntersectionObserver(
    (entries, io) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("donut-animate");
        entry.target.querySelectorAll(".legend-value").forEach((el) => {
          animateCounter(el);
        });
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.4 },
  );

  donutObserver.observe(donutWrap);
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  if (Number.isNaN(target)) return;

  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const duration = 1400;
  let startTime = null;

  function step(timestamp) {
    if (startTime === null) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = Number.isInteger(target)
      ? Math.floor(eased * target)
      : (eased * target).toFixed(1);

    el.textContent = `${prefix}${currentValue}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = `${prefix}${target}${suffix}`;
    }
  }

  requestAnimationFrame(step);
}

function animateTrend(el) {
  const target = parseFloat(el.dataset.trendTarget);
  if (Number.isNaN(target)) return;

  const suffix = el.dataset.suffix || "";
  const sign = target >= 0 ? "+" : "";
  const duration = 1400;
  let startTime = null;

  function step(timestamp) {
    if (startTime === null) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue =
      target >= 0 ? Math.floor(eased * target) : Math.ceil(eased * target);

    el.textContent = `${sign}${currentValue}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = `${sign}${target}${suffix}`;
    }
  }

  requestAnimationFrame(step);
}

/*
Website System Name: DONORDOC-01 V1
Author: FRONTLENS LLC
License: For personal/business use only. Redistribution, resale, or sublicensing is strictly Copyright (c) 2026 FRONTLENS LLC. All rights reserved.
*/

// Preloader: show secondary background with primary-colored spinner until all assets are loaded
(function initPreloader() {
  try {
    const body = document.body;
    if (!body) return;
    body.classList.add("loading");

    const preloader = document.createElement("div");
    preloader.id = "preloader";
    preloader.innerHTML =
      '<div class="preloader-spinner" role="status" aria-label="Loading"></div>';
    body.appendChild(preloader);

    window.addEventListener("load", () => {
      // Hide overlay after load; allow CSS transition to finish before removal
      preloader.classList.add("preloader-hidden");
      body.classList.remove("loading");
      setTimeout(() => preloader.remove(), 450);
    });
  } catch (err) {
    // Fail-safe: never block load if something goes wrong
    console.error("Preloader init error:", err);
  }
})();

// Throttle function to limit how often a function can fire
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

document.addEventListener("DOMContentLoaded", function () {
  initStickyHeader();
  initNavScroll();
  initMobileMenu();
  initSwipers();
  initServicesReveal();
  initBackToTop();
  initLazyImages();
  initFooterYear();
  initSectionVisibility();
  initConsultationSection();
  initFaqAccordion();
  initFooterAccordion();

  window.addEventListener("load", () => {
    if (location.hash == "#health-cta") window.scrollTo(0, 0);
  });
});

const DISABLED_APPOINTMENT_TIMES = [
  "12:00 AM",
  "12:15 AM",
  "12:30 AM",
  "12:45 AM",
  "1:00 AM",
  "1:15 AM",
  "1:30 AM",
  "1:45 AM",
  "2:00 AM",
  "2:15 AM",
  "2:30 AM",
  "2:45 AM",
  "3:00 AM",
  "3:15 AM",
  "3:30 AM",
  "3:45 AM",
  "4:00 AM",
  "4:15 AM",
  "4:30 AM",
  "4:45 AM",
  "5:00 AM",
  "5:15 AM",
  "5:30 AM",
  "5:45 AM",
  "6:00 AM",
  "6:15 AM",
  "6:30 AM",
  "6:45 AM",
  "7:00 AM",
  "7:15 AM",
  "7:30 AM",
  "7:45 AM",
  "8:00 AM",
  "8:15 AM",
  "8:30 AM",
  "8:45 AM",
];

function initConsultationSection() {
  try {
    const section = document.getElementById("consultation-cta");
    if (!section) return;

    if (typeof window.FLDatePicker === "function") {
      const dateEl = document.getElementById("consultation-date");
      const timeEl = document.getElementById("consultation-time");

      if (dateEl) {
        new window.FLDatePicker(dateEl, {
          type: "date",
          placeholder: "Select date",
          disablePast: true,
          closeOnSelect: false,
          closeOnSelectDelay: 400,
        });
      }

      if (timeEl) {
        new window.FLDatePicker(timeEl, {
          type: "time",
          timeStep: 15,
          placeholder: "Select time",
          closeOnSelect: false,
          closeOnSelectDelay: 400,
          disabledTimes: DISABLED_APPOINTMENT_TIMES,
        });
      }
    }

    const selects = section.querySelectorAll(".consultation-select");
    let activeSelect = null;

    selects.forEach((select) => {
      const selected = select.querySelector(".selected");
      const options = select.querySelector(".options");
      if (!selected || !options) return;

      selected.addEventListener("click", function (e) {
        e.stopPropagation();

        if (select === activeSelect) {
          options.classList.remove("show-drop");
          activeSelect = null;
          return;
        }

        closeAllDropdowns(selects, select);
        options.classList.add("show-drop");
        activeSelect = select;
      });

      selected.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selected.click();
        }
      });

      select.querySelectorAll(".option").forEach((option) => {
        option.addEventListener("click", function (e) {
          e.stopPropagation();
          selected.textContent = this.textContent;
          selected.classList.remove("is-placeholder");
          options.classList.remove("show-drop");
          activeSelect = null;
        });
      });
    });

    document.addEventListener("click", function () {
      if (!activeSelect) return;
      const options = activeSelect.querySelector(".options");
      if (options) options.classList.remove("show-drop");
      activeSelect = null;
    });

    const form = section.querySelector(".consultation-form");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const coverage =
          section
            .querySelector("#consultation-coverage .selected")
            ?.textContent.trim() || "";
        const contactMethod =
          section
            .querySelector("#consultation-contact .selected")
            ?.textContent.trim() || "";

        const payload = {
          date:
            section
              .querySelector("#consultation-date .fl-picker-input")
              ?.value.trim() || "",
          time:
            section
              .querySelector("#consultation-time .fl-picker-input")
              ?.value.trim() || "",
          coverageType: coverage,
          contactMethod,
          firstName:
            section.querySelector("#consultation-first-name")?.value.trim() ||
            "",
          lastName:
            section.querySelector("#consultation-last-name")?.value.trim() ||
            "",
          email:
            section.querySelector("#consultation-email")?.value.trim() || "",
          phone:
            section.querySelector("#consultation-phone")?.value.trim() || "",
          notes:
            section.querySelector("#consultation-notes")?.value.trim() || "",
        };

        alert(JSON.stringify(payload, null, 2));
      });
    }
  } catch (err) {
    console.error("initConsultationSection error:", err);
  }
}

function initSectionVisibility() {
  try {
    fetch("assets/config/sections.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to load sections.json");
        }
        return response.json();
      })
      .then(function (config) {
        if (!config || typeof config !== "object") {
          return;
        }

        Object.keys(config).forEach(function (key) {
          var enabled = !!config[key];
          var section = document.querySelector(
            '[data-section-key="' + key + '"]',
          );

          if (!section) {
            return;
          }

          section.hidden = !enabled;
        });
      })
      .catch(function (error) {
        console.error("Error applying section visibility config:", error);
      });
  } catch (err) {
    console.error("initSectionVisibility error:", err);
  }
}

function initFooterYear() {
  try {
    const yearEl = document.getElementById("footer-year");
    if (!yearEl) return;

    const currentYear = new Date().getFullYear();
    yearEl.textContent = currentYear;
    yearEl.setAttribute("datetime", String(currentYear));
  } catch (err) {
    console.error("Footer year init error:", err);
  }
}

function initStickyHeader() {
  const header = document.getElementById("header");
  const hero = document.querySelector(".section-health");

  if (!header || !hero) return;

  const updateHeroPadding = () => {
    hero.style.paddingTop = `${header.offsetHeight}px`;
  };

  window.addEventListener("load", updateHeroPadding);

  // Use throttled version for scroll performance
  const throttledUpdate = throttle(updateHeroPadding, 100);

  const obs = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      if (!entry) return;

      header.classList.toggle("sticky", !entry.isIntersecting);
      if (!entry.isIntersecting) {
        header.style.background = "#fff";
        header.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
      } else {
        header.style.background = "transparent";
        header.style.boxShadow = "none";
      }
      if (!entry.isIntersecting) throttledUpdate();
    },
    {
      root: null,
      threshold: 0,
      rootMargin: "-100px",
    },
  );

  obs.observe(hero);
}

function initNavScroll() {
  const sectionToNavHash = {
    "health-cta": "#health-cta",
    featured: "#health-cta",
    "about-cta": "#about-cta",
    "services-cta": "#services-cta",
    "how-it-works-cta": "#how-it-works-cta",
    "pricing-cta": "#services-cta",
    "testimonials-cta": "#testimonials-cta",
    "faq-cta": "#faq-cta",
    "consultation-cta": "#consultation-cta",
    "final-cta": "#final-cta",
    "contact-cta": "#consultation-cta",
  };

  const sections = Array.from(document.querySelectorAll("section[id]")).filter(
    (s) => Object.prototype.hasOwnProperty.call(sectionToNavHash, s.id),
  );

  const navLinks = document.querySelectorAll(
    '#navbarSupportedContent a[href^="#"]:not([href="#"]), #offcanvasNavbar a[href^="#"]:not([href="#"])',
  );

  const linkMap = {};
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!linkMap[href]) linkMap[href] = [];
    linkMap[href].push(link);
  });

  const getScrollAnchorPx = () => {
    const header = document.getElementById("header");
    const h = header ? header.offsetHeight : 0;
    const raw =
      getComputedStyle(document.documentElement).getPropertyValue(
        "--sticky-bar-h",
      ) || "";
    const barExtra = parseFloat(raw.trim()) || 0;
    return h + barExtra + 24;
  };

  const updateActiveNav = () => {
    const anchorPx = getScrollAnchorPx();
    const docEl = document.documentElement;
    const scrollBottom = window.innerHeight + window.scrollY;

    let activeHash = "#health-cta";

    const atBottom = scrollBottom >= docEl.scrollHeight - 2;
    if (atBottom) {
      activeHash = "#consultation-cta";
    } else {
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();
        if (rect.top <= anchorPx) {
          activeHash = sectionToNavHash[section.id] || activeHash;
        }
      }
    }

    if (window.innerWidth > 768) {
      history.replaceState(null, null, activeHash);
    }

    navLinks.forEach((l) => l.classList.remove("active"));
    const group = linkMap[activeHash];
    if (group) {
      group.forEach((l) => l.classList.add("active"));
    }
  };

  const throttledUpdate = throttle(updateActiveNav, 50);
  window.addEventListener("scroll", throttledUpdate, { passive: true });
  window.addEventListener("resize", throttledUpdate);
  updateActiveNav();
}

function initMobileMenu() {
  const toggler = document.querySelector("[data-nav-toggle]");
  const offcanvas = document.getElementById("offcanvasNavbar");
  const header = document.getElementById("header");

  if (!toggler || !offcanvas) return;

  let isOpen = false;
  let isClosing = false;
  let closeFallback = null;

  const offcanvasLinks = offcanvas.querySelectorAll(
    'a[href^="#"]:not([href="#"])',
  );

  const setTogglerOpen = (open) => {
    toggler.classList.toggle("opened", open);
    toggler.setAttribute("aria-expanded", open ? "true" : "false");
    toggler.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Toggle navigation",
    );
  };

  const finishClose = () => {
    offcanvas.classList.remove("is-closing");
    isClosing = false;
    header?.classList.remove("mobile-nav-open");
    document.dispatchEvent(new CustomEvent("mobilenav:close"));
  };

  const open = () => {
    if (isOpen || isClosing) return;

    isOpen = true;
    offcanvas.classList.remove("is-closing");
    offcanvas.classList.add("show");
    header?.classList.add("mobile-nav-open");
    setTogglerOpen(true);
    document.body.style.overflow = "hidden";
    document.dispatchEvent(new CustomEvent("mobilenav:open"));
  };

  const close = () => {
    if (!isOpen || isClosing) return;

    isClosing = true;
    isOpen = false;

    // Morph toggler back to burger immediately, before panel slide-out starts.
    setTogglerOpen(false);
    document.body.style.overflow = "";

    offcanvas.classList.remove("show");
    offcanvas.classList.add("is-closing");

    const onCloseEnd = (event) => {
      if (event && event.propertyName !== "transform") return;
      offcanvas.removeEventListener("transitionend", onCloseEnd);
      if (closeFallback) clearTimeout(closeFallback);
      finishClose();
    };

    closeFallback = setTimeout(() => onCloseEnd(null), 1100);
    offcanvas.addEventListener("transitionend", onCloseEnd);
  };

  const toggle = () => {
    if (isOpen) close();
    else open();
  };

  toggler.addEventListener("click", toggle);

  offcanvasLinks.forEach((link) => {
    link.addEventListener("click", close);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) {
      close();
    }
  });
}

function initSwipers() {
  // Pricing swiper - disable autoplay by default
  const pricingSwiper = new Swiper(".pricing-swiper", {
    slidesPerView: 3,
    spaceBetween: 24,
    loop: false,
    initialSlide: 1,
    grabCursor: true,
    allowTouchMove: true,
    speed: 600,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      enabled: false,
    },
    pagination: {
      el: ".pricing-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".pricing-next",
      prevEl: ".pricing-prev",
    },
    passiveListeners: true,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 16,
        centeredSlides: true,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 24,
        centeredSlides: false,
      },
    },
  });

  // Testimonials swiper
  const testimonialsSwiper = new Swiper(".testimonial-swiper", {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    grabCursor: true,
    allowTouchMove: true,
    speed: 600,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      enabled: false,
    },
    pagination: {
      el: ".testimonials-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".testimonials-next",
      prevEl: ".testimonials-prev",
    },
    passiveListeners: true,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 16,
        centeredSlides: true,
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 24,
        centeredSlides: false,
      },
    },
  });

  // Enable autoplay only when swipers are in viewport for better performance
  initSwiperAutoplayInView([pricingSwiper, testimonialsSwiper]);
}

// Enable swiper autoplay only when in viewport
function initSwiperAutoplayInView(swipers) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const swiper = swipers.find((s) => s.el === entry.target);
        if (swiper) {
          if (entry.isIntersecting) {
            swiper.autoplay.start();
          } else {
            swiper.autoplay.stop();
          }
        }
      });
    },
    { threshold: 0.5 },
  );

  swipers.forEach((swiper) => {
    observer.observe(swiper.el);
  });
}

function initServicesReveal() {
  const section = document.querySelector(".services-section");
  if (!section) return;

  const cards = Array.from(section.querySelectorAll(".service-card"));
  if (!cards.length) return;

  const mq = window.matchMedia("(max-width: 1023.98px)");
  const ROW_STAGGER_MS = 120;
  const observers = [];

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function resetCards() {
    cards.forEach((card) => {
      card.classList.remove("is-reveal-pending", "is-revealed");
      card.style.removeProperty("--reveal-delay");
    });
  }

  function disconnectObservers() {
    observers.splice(0).forEach((observer) => observer.disconnect());
  }

  function revealRow(rowCards) {
    rowCards.forEach((card) => {
      card.classList.add("is-revealed");
      card.classList.remove("is-reveal-pending");
    });
  }

  function setupReveal() {
    disconnectObservers();
    resetCards();

    if (!mq.matches || prefersReducedMotion) {
      revealRow(cards);
      return;
    }

    const columns = 2;
    const rows = new Map();

    cards.forEach((card, index) => {
      const rowIndex = Math.floor(index / columns);
      if (!rows.has(rowIndex)) rows.set(rowIndex, []);
      rows.get(rowIndex).push(card);
    });

    rows.forEach((rowCards, rowIndex) => {
      rowCards.forEach((card) => {
        card.classList.add("is-reveal-pending");
        card.style.setProperty(
          "--reveal-delay",
          `${rowIndex * ROW_STAGGER_MS}ms`,
        );
      });

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            revealRow(rowCards);
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
      );

      observer.observe(rowCards[0]);
      observers.push(observer);
    });
  }

  setupReveal();
  mq.addEventListener("change", setupReveal);
}

function initBackToTop() {
  const goTopButton = document.getElementById("up-arrow");
  if (!goTopButton) return;

  // Use throttled scroll event for better performance
  window.addEventListener(
    "scroll",
    throttle(function () {
      goTopButton.classList.toggle("show", window.scrollY > 300);
    }, 100),
  );

  goTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function closeAllDropdowns(allDropdowns, exceptThis = null) {
  allDropdowns.forEach((select) => {
    if (select !== exceptThis) {
      const options = select.querySelector(".options");
      options.classList.remove("show-drop");
    }
  });
}

function initLazyImages() {
  document.querySelectorAll("header img").forEach((img) => {
    img.loading = "eager";
    img.decoding = "async";
    if (!img.hasAttribute("fetchpriority")) {
      img.setAttribute("fetchpriority", "high");
    }
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderFaqItem(item, index) {
  const number = String(index + 1).padStart(2, "0");
  const triggerId = `faq-trigger-${number}`;
  const panelId = `faq-panel-${number}`;
  const isOpen = Boolean(item.open);
  const question = escapeHtml(item.question || "");
  const answer = escapeHtml(item.answer || "");

  return `
    <div class="faq-item${isOpen ? " is-open" : ""}">
      <h3 class="faq-item-heading">
        <button
          type="button"
          class="faq-item-trigger"
          id="${triggerId}"
          aria-expanded="${isOpen ? "true" : "false"}"
          aria-controls="${panelId}"
        >
          <span class="faq-item-number">${number}</span>
          <span class="faq-item-divider" aria-hidden="true"></span>
          <span class="faq-item-question">${question}</span>
          <span class="faq-item-toggle" aria-hidden="true">
            <span class="faq-item-toggle-icon faq-item-toggle-icon-plus">+</span>
            <span class="faq-item-toggle-icon faq-item-toggle-icon-minus">&#8722;</span>
          </span>
        </button>
      </h3>
      <div
        class="faq-item-panel"
        id="${panelId}"
        role="region"
        aria-labelledby="${triggerId}"
        ${isOpen ? "" : "hidden"}
      >
        <div class="faq-item-panel-inner">
          <div class="faq-item-panel-content">
            <p>${answer}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function wireFaqAccordion(section) {
  const items = Array.from(section.querySelectorAll(".faq-item"));
  if (!items.length) return;

  const closePanel = (item, panel, trigger) => {
    if (!item.classList.contains("is-open")) return;

    item.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");

    panel.style.transition =
      "height 300ms ease-in-out, opacity 280ms ease-in-out";
    panel.style.height = `${panel.scrollHeight}px`;
    panel.style.opacity = "1";

    requestAnimationFrame(() => {
      panel.style.height = "0px";
      panel.style.opacity = "0";
    });

    const onCloseEnd = (event) => {
      if (event.propertyName !== "height") return;
      panel.removeEventListener("transitionend", onCloseEnd);
      panel.hidden = true;
      panel.style.height = "";
      panel.style.opacity = "";
      panel.style.transition = "";
    };

    panel.addEventListener("transitionend", onCloseEnd);
  };

  const openPanel = (item, panel, trigger) => {
    item.classList.add("is-open");
    panel.hidden = false;
    panel.style.transition = "height 350ms ease-out, opacity 350ms ease-out";
    panel.style.height = "0px";
    panel.style.opacity = "0";

    const targetHeight = panel.scrollHeight;

    requestAnimationFrame(() => {
      panel.style.height = `${targetHeight}px`;
      panel.style.opacity = "1";
    });

    const onOpenEnd = (event) => {
      if (event.propertyName !== "height") return;
      panel.removeEventListener("transitionend", onOpenEnd);
      panel.style.height = "auto";
      trigger.setAttribute("aria-expanded", "true");
    };

    panel.addEventListener("transitionend", onOpenEnd);
  };

  items.forEach((item) => {
    const trigger = item.querySelector(".faq-item-trigger");
    const panel = item.querySelector(".faq-item-panel");
    if (!trigger || !panel) return;

    if (item.classList.contains("is-open")) {
      panel.hidden = false;
      panel.style.height = "auto";
      panel.style.opacity = "1";
      trigger.setAttribute("aria-expanded", "true");
    }

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      if (isOpen) {
        closePanel(item, panel, trigger);
        return;
      }

      items.forEach((otherItem) => {
        if (otherItem === item) return;
        const otherTrigger = otherItem.querySelector(".faq-item-trigger");
        const otherPanel = otherItem.querySelector(".faq-item-panel");
        if (otherTrigger && otherPanel) {
          closePanel(otherItem, otherPanel, otherTrigger);
        }
      });

      openPanel(item, panel, trigger);
    });
  });
}

function initFaqAccordion() {
  try {
    const section = document.querySelector(".section-faq");
    const faqList = document.getElementById("faq-list");
    if (!section || !faqList) return;

    fetch("assets/config/faq.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to load faq.json");
        }
        return response.json();
      })
      .then(function (config) {
        const items = Array.isArray(config?.items) ? config.items : [];
        if (!items.length) return;

        faqList.innerHTML = items.map(renderFaqItem).join("");
        wireFaqAccordion(section);
      })
      .catch(function (error) {
        console.error("initFaqAccordion error:", error);
      });
  } catch (e) {
    console.error("initFaqAccordion error:", e);
  }
}

function wireFooterAccordion(footer) {
  const groups = Array.from(footer.querySelectorAll(".footer-nav-group"));
  if (!groups.length) return;

  const mq = window.matchMedia("(max-width: 991.98px)");

  const closePanel = (group, panel, trigger) => {
    if (!group.classList.contains("is-open")) return;

    group.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");

    panel.style.transition = "height 350ms ease-out, opacity 350ms ease-out";
    panel.style.height = `${panel.scrollHeight}px`;
    panel.style.opacity = "1";

    requestAnimationFrame(() => {
      panel.style.height = "0px";
      panel.style.opacity = "0";
    });

    const onCloseEnd = (event) => {
      if (event.propertyName !== "height") return;
      panel.removeEventListener("transitionend", onCloseEnd);
      panel.hidden = true;
      panel.style.height = "";
      panel.style.opacity = "";
      panel.style.transition = "";
    };

    panel.addEventListener("transitionend", onCloseEnd);
  };

  const openPanel = (group, panel, trigger) => {
    group.classList.add("is-open");
    panel.hidden = false;
    panel.style.transition = "height 350ms ease-out, opacity 350ms ease-out";
    panel.style.height = "0px";
    panel.style.opacity = "0";

    const targetHeight = panel.scrollHeight;

    requestAnimationFrame(() => {
      panel.style.height = `${targetHeight}px`;
      panel.style.opacity = "1";
    });

    const onOpenEnd = (event) => {
      if (event.propertyName !== "height") return;
      panel.removeEventListener("transitionend", onOpenEnd);
      panel.style.height = "auto";
      trigger.setAttribute("aria-expanded", "true");
    };

    panel.addEventListener("transitionend", onOpenEnd);
  };

  const resetDesktopPanels = () => {
    groups.forEach((group) => {
      const trigger = group.querySelector(".footer-nav-trigger");
      const panel = group.querySelector(".footer-nav-panel");
      if (!trigger || !panel) return;

      group.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      panel.hidden = false;
      panel.style.height = "";
      panel.style.opacity = "";
      panel.style.transition = "";
    });
  };

  const bindAccordion = () => {
    groups.forEach((group) => {
      const trigger = group.querySelector(".footer-nav-trigger");
      const panel = group.querySelector(".footer-nav-panel");
      if (!trigger || !panel) return;

      if (trigger.dataset.footerBound === "true") return;
      trigger.dataset.footerBound = "true";

      trigger.addEventListener("click", () => {
        if (!mq.matches) return;

        const isOpen = group.classList.contains("is-open");

        if (isOpen) {
          closePanel(group, panel, trigger);
          return;
        }

        groups.forEach((otherGroup) => {
          if (otherGroup === group) return;
          const otherTrigger = otherGroup.querySelector(".footer-nav-trigger");
          const otherPanel = otherGroup.querySelector(".footer-nav-panel");
          if (otherTrigger && otherPanel) {
            closePanel(otherGroup, otherPanel, otherTrigger);
          }
        });

        openPanel(group, panel, trigger);
      });
    });
  };

  const syncMode = () => {
    if (mq.matches) {
      groups.forEach((group) => {
        const trigger = group.querySelector(".footer-nav-trigger");
        const panel = group.querySelector(".footer-nav-panel");
        if (!trigger || !panel || group.classList.contains("is-open")) return;
        panel.hidden = true;
        panel.style.height = "0px";
        panel.style.opacity = "0";
        trigger.setAttribute("aria-expanded", "false");
      });
    } else {
      resetDesktopPanels();
    }
  };

  bindAccordion();
  syncMode();

  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", syncMode);
  } else if (typeof mq.addListener === "function") {
    mq.addListener(syncMode);
  }
}

function initFooterAccordion() {
  try {
    const footer = document.getElementById("footer");
    if (!footer) return;
    wireFooterAccordion(footer);
  } catch (e) {
    console.error("initFooterAccordion error:", e);
  }
}

/* ===== PROMO STICKY BAR - self-contained, safe to delete ===== */
(function initPromoStickyBar() {
  function startStickyBar(root) {
    const bar = document.getElementById("sticky-bar");
    const placeholder = root.querySelector(".sticky-bar-placeholder");
    const footer = document.getElementById("footer");
    const hero = document.querySelector(".section-health");
    const header = document.getElementById("header");

    if (!bar || !placeholder || !footer || !hero || !header) return;

    const DOCK_BOTTOM_ENTER_PX = 120;
    const DOCK_BOTTOM_EXIT_PX = 280;
    let latchBottom = false;
    let activeState = null;

    function setStickyBarCssVar(px) {
      document.documentElement.style.setProperty(
        "--sticky-bar-h",
        `${Math.max(0, px)}px`,
      );
    }

    function computeNextState() {
      const heroRect = hero.getBoundingClientRect();
      const docEl = document.documentElement;
      const vv = window.visualViewport;
      const vh =
        vv && typeof vv.height === "number" ? vv.height : window.innerHeight;
      const scrollBottom = window.scrollY + vh;

      let nearDockBottom =
        scrollBottom >= docEl.scrollHeight - DOCK_BOTTOM_ENTER_PX;

      const belowDockBottomEscape =
        scrollBottom < docEl.scrollHeight - DOCK_BOTTOM_EXIT_PX;

      if (latchBottom) {
        if (belowDockBottomEscape) latchBottom = false;
      } else if (nearDockBottom) latchBottom = true;

      const atHeroBand = heroRect.top >= -40;

      if (latchBottom) return "bottom";
      if (atHeroBand) return "top";
      return "fixed";
    }

    function applyState(nextState) {
      placeholder.style.height = "0px";
      placeholder.classList.remove("is-active");
      footer.style.paddingBottom = "";
      footer.classList.remove("footer-sticky-bar-dock");
      bar.classList.remove("sticky-bar-fixed", "sticky-bar-docked-bottom");
      root.classList.remove("sticky-bar-root-bottom");

      if (footer.contains(root)) {
        header.before(root);
      }

      if (nextState === "bottom") {
        footer.appendChild(root);
        root.classList.add("sticky-bar-root-bottom");
        bar.classList.add("sticky-bar-docked-bottom");
        footer.classList.add("footer-sticky-bar-dock");
        setStickyBarCssVar(0);
      } else if (nextState === "fixed") {
        bar.classList.add("sticky-bar-fixed");
        const hFix = Math.max(bar.offsetHeight, 1);
        placeholder.style.height = `${hFix}px`;
        placeholder.classList.add("is-active");
        setStickyBarCssVar(hFix);
      } else {
        const hTop = Math.max(bar.offsetHeight, 1);
        setStickyBarCssVar(hTop);
      }

      activeState = nextState;
    }

    function syncLayout() {
      if (root.classList.contains("sticky-bar-hidden")) {
        if (activeState !== "hidden") {
          setStickyBarCssVar(0);
          activeState = "hidden";
        }
        return;
      }

      const nextState = computeNextState();
      if (nextState === activeState) return;
      applyState(nextState);
    }

    function forceSync() {
      activeState = null;
      syncLayout();
    }

    document.addEventListener("mobilenav:open", () => {
      root.classList.remove("sticky-bar-hidden");
      applyState("fixed");
    });

    document.addEventListener("mobilenav:close", () => {
      root.classList.remove("sticky-bar-hidden");
      forceSync();
    });

    const throttledSync = throttle(syncLayout, 50);
    window.addEventListener("scroll", throttledSync, { passive: true });
    window.addEventListener("resize", forceSync);
    window.addEventListener("load", forceSync);
    syncLayout();
  }

  function boot() {
    const root = document.getElementById("sticky-bar-root");
    if (!root) return;

    fetch("assets/config/sections.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load sections.json");
        }
        return response.json();
      })
      .then((config) => {
        if (config && config["promo-bar"] === false) {
          root.remove();
          document.documentElement.style.setProperty("--sticky-bar-h", "0px");
          return;
        }
        startStickyBar(root);
      })
      .catch((error) => {
        console.error("Promo sticky bar config error:", error);
        startStickyBar(root);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
/* ===== END PROMO STICKY BAR ===== */

/* ============================================================
   AURELIUS — Private Trading Club
   Вся логика страницы. Контакты меняются в блоке КОНТАКТЫ ниже.
   ============================================================ */

"use strict";

/* ------------------------------------------------------------
   1. КОНТАКТЫ
   Поменяйте значения — они подставятся во все кнопки и ссылки.
   ------------------------------------------------------------ */

const КОНТАКТЫ = {
  telegram: "https://t.me/",           // ← ссылка на ваш Telegram
  email: "hello@example.com",          // ← ваш e-mail
};

/* ------------------------------------------------------------
   2. Подстановка контактов
   ------------------------------------------------------------ */

document.querySelectorAll('[data-link="telegram"]').forEach(function (el) {
  el.setAttribute("href", КОНТАКТЫ.telegram);
});

document.querySelectorAll('[data-link="email"]').forEach(function (el) {
  el.setAttribute("href", "mailto:" + КОНТАКТЫ.email);
});

/* ------------------------------------------------------------
   3. Шапка: фон при прокрутке
   ------------------------------------------------------------ */

const header = document.getElementById("header");

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* ------------------------------------------------------------
   4. Мобильное меню
   ------------------------------------------------------------ */

const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");

function closeMenu() {
  if (!burger || !mobileMenu) return;
  burger.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
  burger.setAttribute("aria-label", "Открыть меню");
  mobileMenu.classList.remove("is-open");
  mobileMenu.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
}

function openMenu() {
  if (!burger || !mobileMenu) return;
  burger.classList.add("is-open");
  burger.setAttribute("aria-expanded", "true");
  burger.setAttribute("aria-label", "Закрыть меню");
  mobileMenu.classList.add("is-open");
  mobileMenu.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
}

if (burger && mobileMenu) {
  burger.addEventListener("click", function () {
    if (mobileMenu.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 980) closeMenu();
  });
}

/* ------------------------------------------------------------
   5. Появление блоков при прокрутке
   ------------------------------------------------------------ */

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach(function (item) {
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach(function (item) {
    item.classList.add("is-visible");
  });
}

/* ------------------------------------------------------------
   6. Прорисовка графика
   ------------------------------------------------------------ */

const chartCards = document.querySelectorAll(".desk-card, .record-panel");

if ("IntersectionObserver" in window) {
  const chartObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-drawn");
          chartObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  chartCards.forEach(function (card) {
    chartObserver.observe(card);
  });
} else {
  chartCards.forEach(function (card) {
    card.classList.add("is-drawn");
  });
}

/* ------------------------------------------------------------
   6.1. Свечной график в первом экране
   Данные декоративные: это схема, а не биржевая лента.
   ------------------------------------------------------------ */

const heroChart = document.getElementById("heroChart");

if (heroChart) {
  const candlesGroup = document.getElementById("heroCandles");
  const volumesGroup = document.getElementById("heroVolumes");
  const area = document.getElementById("heroArea");
  const trend = document.getElementById("heroTrend");
  const live = document.getElementById("heroLive");

  if (candlesGroup && volumesGroup && area && trend && live) {
    const SVG_NS = "http://www.w3.org/2000/svg";
    const closes = [
      212, 206, 214, 209, 218, 224, 219, 227, 222, 230, 236, 231,
      225, 233, 241, 236, 245, 252, 246, 240, 249, 257, 252, 261,
      269, 263, 256, 265, 274, 281, 275, 268, 277, 286, 293, 287,
      296, 304, 298, 291, 300, 309, 316, 310, 319, 327, 321, 330,
    ];

    const WIDTH = 640;
    const TOP = 28;
    const BOTTOM = 292;
    const PAD = 16;
    const min = Math.min.apply(null, closes) - 12;
    const max = Math.max.apply(null, closes) + 12;
    const step = (WIDTH - PAD * 2) / (closes.length - 1);

    function xAt(index) {
      return PAD + index * step;
    }

    function yAt(value) {
      return BOTTOM - ((value - min) / (max - min)) * (BOTTOM - TOP);
    }

    const points = [];

    closes.forEach(function (close, index) {
      const open =
        index === 0
          ? close - 5
          : closes[index - 1] + (((index * 3) % 5) - 2) * 0.9;
      const high = Math.max(open, close) + 2 + ((index * 7) % 8);
      const low = Math.min(open, close) - 2 - ((index * 5) % 9);
      const isUp = close >= open;
      const x = xAt(index);
      const yOpen = yAt(open);
      const yClose = yAt(close);
      const bodyY = Math.min(yOpen, yClose);
      const bodyH = Math.max(Math.abs(yOpen - yClose), 1.6);

      const candle = document.createElementNS(SVG_NS, "g");
      candle.setAttribute("class", "candle " + (isUp ? "candle--up" : "candle--down"));
      candle.style.setProperty("--i", index);

      const wick = document.createElementNS(SVG_NS, "line");
      wick.setAttribute("x1", x.toFixed(1));
      wick.setAttribute("x2", x.toFixed(1));
      wick.setAttribute("y1", yAt(high).toFixed(1));
      wick.setAttribute("y2", yAt(low).toFixed(1));

      const body = document.createElementNS(SVG_NS, "rect");
      body.setAttribute("x", (x - 3.25).toFixed(1));
      body.setAttribute("y", bodyY.toFixed(1));
      body.setAttribute("width", "6.5");
      body.setAttribute("height", bodyH.toFixed(1));
      body.setAttribute("rx", "0.6");

      candle.appendChild(wick);
      candle.appendChild(body);
      candlesGroup.appendChild(candle);

      const volumeHeight = 7 + ((index * 13) % 25);
      const volume = document.createElementNS(SVG_NS, "rect");
      volume.setAttribute("class", "vol " + (isUp ? "vol--up" : "vol--down"));
      volume.style.setProperty("--i", index);
      volume.setAttribute("x", (x - 3.25).toFixed(1));
      volume.setAttribute("y", (326 - volumeHeight).toFixed(1));
      volume.setAttribute("width", "6.5");
      volume.setAttribute("height", volumeHeight.toFixed(1));
      volume.setAttribute("rx", "0.6");
      volumesGroup.appendChild(volume);

      points.push({ x: x, y: yClose });

      if (index === closes.length - 1) {
        live.setAttribute("transform", "translate(" + x.toFixed(1) + "," + yClose.toFixed(1) + ")");
      }
    });

    function smoothPath(items) {
      let d = "M " + items[0].x.toFixed(1) + " " + items[0].y.toFixed(1);

      for (let i = 0; i < items.length - 1; i += 1) {
        const p0 = items[i - 1] || items[i];
        const p1 = items[i];
        const p2 = items[i + 1];
        const p3 = items[i + 2] || p2;

        const c1x = p1.x + (p2.x - p0.x) / 6;
        const c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6;
        const c2y = p2.y - (p3.y - p1.y) / 6;

        d +=
          " C " +
          c1x.toFixed(1) +
          " " +
          c1y.toFixed(1) +
          ", " +
          c2x.toFixed(1) +
          " " +
          c2y.toFixed(1) +
          ", " +
          p2.x.toFixed(1) +
          " " +
          p2.y.toFixed(1);
      }

      return d;
    }

    const linePath = smoothPath(points);
    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];

    trend.setAttribute("d", linePath);
    area.setAttribute(
      "d",
      linePath +
        " L " +
        lastPoint.x.toFixed(1) +
        " 326 L " +
        firstPoint.x.toFixed(1) +
        " 326 Z"
    );
  }
}

/* ------------------------------------------------------------
   7. Счётчики цифр
   ------------------------------------------------------------ */

const counters = document.querySelectorAll("[data-count]");

function animateCounter(el) {
  const target = Number(el.getAttribute("data-count"));
  if (!Number.isFinite(target)) return;

  const duration = 1300;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = String(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });
}

/* ------------------------------------------------------------
   8. FAQ: раскрывающиеся вопросы
   ------------------------------------------------------------ */

const faqItems = document.querySelectorAll(".faq__item");

faqItems.forEach(function (item) {
  const button = item.querySelector(".faq__button");
  if (!button) return;

  button.addEventListener("click", function () {
    const isOpen = item.classList.contains("is-open");

    faqItems.forEach(function (other) {
      other.classList.remove("is-open");
      const otherButton = other.querySelector(".faq__button");
      if (otherButton) otherButton.setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

/* ------------------------------------------------------------
   9. Подсветка активного пункта меню
   ------------------------------------------------------------ */

const navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
const navSections = Array.prototype.slice.call(
  document.querySelectorAll("#club, #principles, #desk, #record, #circle, #faq")
);

if ("IntersectionObserver" in window && navLinks.length && navSections.length) {
  const navObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        navLinks.forEach(function (link) {
          link.classList.remove("is-active");
        });

        navLinks.forEach(function (link) {
          if (link.getAttribute("href") === "#" + entry.target.id) {
            link.classList.add("is-active");
          }
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  navSections.forEach(function (section) {
    navObserver.observe(section);
  });
}

/* ------------------------------------------------------------
   10. Мягкое свечение за курсором в первом экране
   ------------------------------------------------------------ */

const hero = document.querySelector(".hero");

if (hero && window.matchMedia("(pointer: fine)").matches) {
  hero.addEventListener("pointermove", function (event) {
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty("--mx", event.clientX - rect.left + "px");
    hero.style.setProperty("--my", event.clientY - rect.top + "px");
  });
}

/* ------------------------------------------------------------
   11. Кнопка «наверх»
   ------------------------------------------------------------ */

const toTop = document.getElementById("toTop");

if (toTop) {
  function updateToTop() {
    toTop.classList.toggle("is-visible", window.scrollY > 700);
  }

  window.addEventListener("scroll", updateToTop, { passive: true });
  updateToTop();

  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ------------------------------------------------------------
   12. Актуальный год в подвале
   ------------------------------------------------------------ */

const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

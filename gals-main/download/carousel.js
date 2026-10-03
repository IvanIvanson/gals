/**
 * GALS carousel: стрелки, точки и автоплей для CSS-карусели из gals.css.
 *
 * Дополняет нативную карусель (.carousel + scroll-snap), а не заменяет её:
 * трек остаётся обычным overflow-x контейнером, поэтому без JS он
 * по-прежнему листается пальцем и колесом. Никаких зависимостей и сборки.
 *
 * Разметка (всё опционально — чего нет, то и не создаётся):
 *
 *   <div class="carousel" data-carousel data-carousel-autoplay="4000">
 *     <div class="carousel-slide">…</div>
 *     <div class="carousel-slide">…</div>
 *     <button type="button" data-carousel-prev aria-label="Previous slide">‹</button>
 *     <button type="button" data-carousel-next aria-label="Next slide">›</button>
 *     <div data-carousel-dots></div>
 *   </div>
 *
 * data-carousel-autoplay — пауза между слайдами в мс (без атрибута автоплея
 * нет). Автоплей встаёт на паузу при наведении, фокусе внутри и в скрытой
 * вкладке, а при prefers-reduced-motion не запускается вовсе; прокрутка
 * в этом случае тоже идёт без анимации.
 *
 * Подключение: <script src="carousel.js" defer></script>
 */
(function () {
  "use strict";

  const REDUCED = "(prefers-reduced-motion: reduce)";

  const prefersReducedMotion = function () {
    return typeof window.matchMedia === "function" && window.matchMedia(REDUCED).matches;
  };

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const initCarousel = function (root) {
    const slides = Array.from(root.children).filter((el) =>
      el.classList.contains("carousel-slide")
    );

    // Один слайд листать некуда — фича молчит.
    if (slides.length < 2) {
      return;
    }

    const prev = root.querySelector("[data-carousel-prev]");
    const next = root.querySelector("[data-carousel-next]");
    const dotsBox = root.querySelector("[data-carousel-dots]");
    const autoplayDelay = Number(root.dataset.carouselAutoplay) || 0;

    const dots = [];
    let current = 0;
    let timer = null;

    const scrollToSlide = function (index) {
      const delta =
        slides[index].getBoundingClientRect().left - root.getBoundingClientRect().left;
      const left = root.scrollLeft + delta;
      const behavior = prefersReducedMotion() ? "auto" : "smooth";

      if (typeof root.scrollTo === "function") {
        root.scrollTo({ left: left, behavior: behavior });
      } else {
        // Фолбэк для сред без Element.scrollTo (в т.ч. тестовый JSDOM).
        root.scrollLeft = left;
      }
    };

    // Активный слайд — тот, чей центр ближе всего к центру трека.
    const activeIndex = function () {
      const box = root.getBoundingClientRect();
      const center = box.left + box.width / 2;
      let best = 0;
      let bestDistance = Infinity;

      slides.forEach(function (slide, index) {
        const rect = slide.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - center);

        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      });

      return best;
    };

    const paint = function () {
      dots.forEach(function (dot, index) {
        dot.setAttribute("aria-current", String(index === current));
      });

      if (prev) {
        prev.disabled = current === 0;
      }

      if (next) {
        next.disabled = current === slides.length - 1;
      }
    };

    const goTo = function (index) {
      current = clamp(index, 0, slides.length - 1);
      scrollToSlide(current);
      paint();
    };

    if (dotsBox) {
      slides.forEach(function (_, index) {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", "Go to slide " + (index + 1));
        dot.addEventListener("click", function () {
          goTo(index);
        });

        dotsBox.appendChild(dot);
        dots.push(dot);
      });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        goTo(current - 1);
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        goTo(current + 1);
      });
    }

    // Синхронизация точек с ручной прокруткой. rAF-троттлинг: событие scroll
    // летит десятки раз за кадр, пересчёт геометрии на каждое — лишняя работа.
    let frame = null;

    root.addEventListener(
      "scroll",
      function () {
        if (frame) {
          return;
        }

        if (typeof requestAnimationFrame !== "function") {
          current = activeIndex();
          paint();
          return;
        }

        frame = requestAnimationFrame(function () {
          frame = null;
          current = activeIndex();
          paint();
        });
      },
      { passive: true }
    );

    const stop = function () {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    const start = function () {
      if (!autoplayDelay || timer || prefersReducedMotion()) {
        return;
      }

      timer = setInterval(function () {
        goTo(current + 1 >= slides.length ? 0 : current + 1);
      }, autoplayDelay);
    };

    if (autoplayDelay) {
      root.addEventListener("mouseenter", stop);
      root.addEventListener("mouseleave", start);

      // Пауза, пока фокус внутри карусели; focusout срабатывает и при
      // переходе между детьми, поэтому стартуем только когда фокус ушёл наружу.
      root.addEventListener("focusin", stop);
      root.addEventListener("focusout", function (event) {
        if (!root.contains(event.relatedTarget)) {
          start();
        }
      });

      document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
          stop();
        } else {
          start();
        }
      });
    }

    current = activeIndex();
    paint();
    start();
  };

  const init = function () {
    document.querySelectorAll("[data-carousel]").forEach(initCarousel);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

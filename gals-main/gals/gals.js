/**
 * GALS runtime: мобильное меню, fluid-картинки, аккордеон-группы
 * и scrollspy. Всё опционально: нет хука в DOM — фича молчит.
 */
(function () {
  "use strict";

  const RESIZE_DELAY = 150;

  const debounce = (fn, wait) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  };

  // menu-------
  const initMenu = function () {
    const menu = document.querySelector(".menu");
    const btnIconMenu = document.querySelector(".icon-menu");

    if (!menu || !btnIconMenu) {
      return;
    }

    btnIconMenu.addEventListener("click", function () {
      const opened = menu.classList.toggle("menu-show");
      btnIconMenu.setAttribute("aria-expanded", String(opened));
    });
  };

  // image-fluid---
  const fitFluidImages = function () {
    document.querySelectorAll("img.container-fluid").forEach(function (img) {
      const containerBlock = img.parentNode;

      if (!containerBlock || !containerBlock.offsetWidth) {
        return;
      }

      const foolBorderWidth = containerBlock.clientLeft * 2;
      const width = containerBlock.offsetWidth - foolBorderWidth;
      const height = containerBlock.offsetHeight - foolBorderWidth;

      // Пишем в style, а не в атрибуты width/height: inline-стили
      // перекрывают атрибуты, поэтому раньше расчёт ничего не менял.
      img.style.width = width + "px";
      img.style.height = height + "px";
    });
  };

  // accordion-group: открыть один — закрыть остальные.
  // Событие toggle не всплывает, поэтому слушаем на capture:
  // один делегированный слушатель вместо слушателя на каждый details.
  const initAccordions = function () {
    document.addEventListener(
      "toggle",
      function (event) {
        const details = event.target;

        if (details.tagName !== "DETAILS" || !details.open) {
          return;
        }

        const group = details.closest(".accordion-group");

        if (!group) {
          return;
        }

        group.querySelectorAll("details.accordion[open]").forEach(function (other) {
          if (other !== details) {
            other.open = false;
          }
        });
      },
      true
    );
  };

  // scrollspy: подсвечивает в [data-scrollspy] ссылку на заголовок,
  // который сейчас в «полосе чтения» (середина окна).
  const initScrollspy = function () {
    if (!("IntersectionObserver" in window)) {
      return;
    }

    const navs = function () {
      return document.querySelectorAll("[data-scrollspy]");
    };

    if (!navs().length) {
      return;
    }

    const spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          const id = entry.target.id;

          navs().forEach(function (nav) {
            nav
              .querySelectorAll("a[aria-current]")
              .forEach(function (active) {
                active.removeAttribute("aria-current");
              });

            const link = nav.querySelector('a[href="#' + id + '"]');

            if (link) {
              link.setAttribute("aria-current", "true");
            }
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    const observeAll = function () {
      document
        .querySelectorAll("h1[id], h2[id], h3[id], h4[id]")
        .forEach(function (heading) {
          spy.observe(heading);
        });
    };

    observeAll();

    // Страницы документации перерисовываются без перезагрузки —
    // наблюдаем заголовки, появившиеся после смены страницы.
    const center = document.querySelector(".container-center");

    if (center && "MutationObserver" in window) {
      new MutationObserver(observeAll).observe(center, { childList: true });
    }
  };

  const init = function () {
    initMenu();
    fitFluidImages();
    initAccordions();
    initScrollspy();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // addEventListener вместо присваивания window.onresize: присваивание
  // затирает чужие обработчики и вызывает пересчёт на каждый кадр ресайза.
  window.addEventListener("resize", debounce(fitFluidImages, RESIZE_DELAY));
})();
 
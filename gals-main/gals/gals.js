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
    document.querySelectorAll(".icon-menu").forEach(function (btnIconMenu) {
      const controlled = btnIconMenu.getAttribute("aria-controls");
      const menu = controlled
        ? document.getElementById(controlled)
        : document.querySelector(".menu");

      if (!menu) {
        return;
      }

      const setOpen = function (open) {
        menu.classList.toggle("menu-show", open);
        btnIconMenu.setAttribute("aria-expanded", String(open));

        if (open) {
          const first = menu.querySelector("a, button");
          if (first) {
            first.focus({ preventScroll: true });
          }
        } else if (menu.contains(document.activeElement)) {
          btnIconMenu.focus({ preventScroll: true });
        }
      };

      btnIconMenu.addEventListener("click", function () {
        setOpen(!menu.classList.contains("menu-show"));
      });

      // Escape и клик вне меню — базовое поведение disclosure-паттерна.
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && btnIconMenu.getAttribute("aria-expanded") === "true") {
          setOpen(false);
          btnIconMenu.focus({ preventScroll: true });
        }
      });

      document.addEventListener("click", function (event) {
        if (
          btnIconMenu.getAttribute("aria-expanded") === "true" &&
          !menu.contains(event.target) &&
          !btnIconMenu.contains(event.target)
        ) {
          setOpen(false);
        }
      });

      menu.addEventListener("click", function (event) {
        if (event.target.closest("a")) {
          setOpen(false);
        }
      });
    });
  };

  // dropdown-------
  // Popover API сам даёт top layer, Escape и light dismiss, но не позиционирует
  // меню и не ведёт ARIA/клавиатуру. Дополняем только элементы .dropdown.
  const initDropdowns = function () {
    document.querySelectorAll("[popovertarget]").forEach(function (trigger) {
      if (trigger.dataset.galsDropdown === "1") {
        return;
      }

      const id = trigger.getAttribute("popovertarget");
      const pop = id && document.getElementById(id);

      if (!pop || !pop.classList.contains("dropdown")) {
        return;
      }

      trigger.dataset.galsDropdown = "1";

      if (!trigger.hasAttribute("aria-haspopup")) {
        trigger.setAttribute("aria-haspopup", "menu");
      }

      trigger.setAttribute("aria-expanded", "false");
      pop.setAttribute("role", "menu");

      const items = Array.prototype.slice.call(
        pop.querySelectorAll('button, a[href], [role="menuitem"]')
      );

      items.forEach(function (item) {
        if (!item.hasAttribute("role")) {
          item.setAttribute("role", "menuitem");
        }
        item.setAttribute("tabindex", "-1");
      });

      let active = -1;

      const place = function () {
        const rect = trigger.getBoundingClientRect();
        const width = Math.min(pop.offsetWidth || 160, window.innerWidth - 16);
        const height = pop.offsetHeight || 0;
        const left = Math.min(
          Math.max(8, rect.left),
          Math.max(8, window.innerWidth - width - 8)
        );
        let top = rect.bottom + 6;

        if (top + height > window.innerHeight - 8) {
          top = rect.top - height - 6;
        }

        pop.style.position = "fixed";
        pop.style.margin = "0";
        pop.style.left = left + "px";
        pop.style.top = Math.max(8, top) + "px";
        pop.style.maxWidth = "calc(100vw - 16px)";
      };

      const focusItem = function (next) {
        if (!items.length) {
          return;
        }

        active = (next + items.length) % items.length;
        items[active].focus();
      };

      pop.addEventListener("toggle", function (event) {
        const open = event.newState
          ? event.newState === "open"
          : pop.matches(":popover-open");

        trigger.setAttribute("aria-expanded", String(open));

        if (open) {
          place();
          focusItem(0);
        } else {
          active = -1;
        }
      });

      pop.addEventListener("keydown", function (event) {
        if (!pop.matches(":popover-open")) {
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          focusItem(active + 1);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          focusItem(active - 1);
        } else if (event.key === "Home") {
          event.preventDefault();
          focusItem(0);
        } else if (event.key === "End") {
          event.preventDefault();
          focusItem(items.length - 1);
        } else if (event.key === "Escape") {
          trigger.focus();
        }
      });

      pop.addEventListener("click", function (event) {
        if (event.target.closest('[role="menuitem"]')) {
          pop.hidePopover();
          trigger.focus();
        }
      });

      window.addEventListener("resize", function () {
        if (pop.matches(":popover-open")) {
          place();
        }
      });
    });
  };

  // image-fluid---
  const fitFluidImages = function () {
    document.querySelectorAll("img.container-fluid").forEach(function (img) {
      const containerBlock = img.parentNode;

      if (!containerBlock || !containerBlock.clientWidth) {
        return;
      }

      // Ширина — content-box родителя: clientWidth уже включает padding,
      // поэтому вычитаем его, иначе картинка рисуется поверх gutter.
      const style = window.getComputedStyle(containerBlock);
      const padding =
        (parseFloat(style.paddingLeft) || 0) +
        (parseFloat(style.paddingRight) || 0);
      const width = Math.max(0, containerBlock.clientWidth - padding);

      // Высоту не фиксируем: иначе картинка растягивается и теряет
      // пропорции. object-fit остаётся на усмотрение пользователя.
      img.style.width = width + "px";
      img.style.height = "auto";
      img.style.maxWidth = "100%";
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
    initDropdowns();
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

  // Документация и приложения заменяют DOM без перезагрузки (SPA).
  // После вставки новой разметки достаточно сообщить: gals:refresh.
  document.addEventListener("gals:refresh", fitFluidImages);
  document.addEventListener("gals:refresh", initDropdowns);
})();
 
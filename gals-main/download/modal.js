/**
 * GALS modal: декларативное открытие нативного <dialog class="modal">.
 *
 * Ловушку фокуса, Escape и ::backdrop даёт сам <dialog> — этот модуль только
 * связывает кнопки с диалогом и возвращает фокус на инициатора.
 *
 * Разметка:
 *
 *   <button data-modal-target="#confirm">Delete</button>
 *
 *   <dialog id="confirm" class="modal">
 *     <form method="dialog">
 *       <h2>Delete the draft?</h2>
 *       <div class="card-footer">
 *         <button data-modal-close>Cancel</button>
 *         <button class="btn btn-primary" value="confirm">Delete</button>
 *       </div>
 *     </form>
 *   </dialog>
 *
 * Поведение:
 *   - data-modal-target="<селектор>" на любом элементе открывает диалог
 *     через showModal(); в значении можно указать CSS-селектор или просто id;
 *   - data-modal-close внутри диалога закрывает его;
 *   - клик по подложке закрывает;
 *   - фокус возвращается на элемент, открывший диалог.
 *
 * Подключение: <script src="modal.js" defer></script>
 */
(function () {
  "use strict";

  // Селектор или голый id: "#confirm" и "confirm" равнозначны.
  const resolve = function (value) {
    if (!value) {
      return null;
    }

    try {
      const found = document.querySelector(value);

      if (found) {
        return found;
      }
    } catch (error) {
      // Не селектор — ниже попробуем как id.
    }

    return document.getElementById(value);
  };

  const isDialog = (node) => Boolean(node) && node.tagName === "DIALOG";

  const open = function (dialog, trigger) {
    // showModal нет только в очень старых браузерах — тогда молчим.
    if (!isDialog(dialog) || typeof dialog.showModal !== "function" || dialog.open) {
      return;
    }

    dialog.galsTrigger = trigger || document.activeElement;
    dialog.showModal();
  };

  const close = function (dialog) {
    if (isDialog(dialog) && dialog.open) {
      dialog.close();
    }
  };

  document.addEventListener("click", function (event) {
    const target = event.target;

    if (!target || typeof target.closest !== "function") {
      return;
    }

    const opener = target.closest("[data-modal-target]");

    if (opener) {
      const dialog = resolve(opener.getAttribute("data-modal-target"));

      if (dialog) {
        event.preventDefault();
        open(dialog, opener);
      }

      return;
    }

    const closer = target.closest("[data-modal-close]");

    if (closer) {
      const dialog = closer.closest("dialog");

      if (dialog) {
        event.preventDefault();
        close(dialog);
      }

      return;
    }

    // Клик по подложке: у .modal нет padding, содержимое лежит внутри формы,
    // поэтому цель клика вне контента — сам <dialog>.
    if (isDialog(target)) {
      close(target);
    }
  });

  // Событие close не всплывает — слушаем на capture (как gals.js для toggle).
  document.addEventListener(
    "close",
    function (event) {
      const dialog = event.target;

      if (!isDialog(dialog)) {
        return;
      }

      const trigger = dialog.galsTrigger;
      dialog.galsTrigger = null;

      // Возврат фокуса инициатору: браузер отдаёт фокус body, если не помочь.
      if (trigger && document.contains(trigger) && typeof trigger.focus === "function") {
        trigger.focus();
      }
    },
    true
  );
})();

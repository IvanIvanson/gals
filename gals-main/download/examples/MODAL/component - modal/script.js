window.onload = function(){

// Получаем все элементы модальных окон
const modals = document.querySelectorAll('.modal');
const openButtons = document.querySelectorAll('.btn-open');
const closeButtons = document.querySelectorAll('[data-close]');
const body = document.body;

// Переменная для хранения активного модального окна
let activeModal = null;

// Функция открытия модального окна
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Добавляем класс active для показа модального окна
    modal.classList.add('active');
    
    // Блокируем прокрутку body
    body.classList.add('modal-open');
    
    // Сохраняем ссылку на активное модальное окно
    activeModal = modal;
    
    // Устанавливаем фокус на кнопку закрытия для доступности
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.focus();
    }
    
    // Устанавливаем aria-hidden в false
    modal.setAttribute('aria-hidden', 'false');
    
    // Создаем событие открытия модального окна
    const openEvent = new CustomEvent('modal:open', {
        detail: { modal }
    });
    modal.dispatchEvent(openEvent);
    
    // Через 300ms (после анимации) фокусируем первый input, если он есть
    setTimeout(() => {
        const firstInput = modal.querySelector('input, textarea, select');
        if (firstInput) {
            firstInput.focus();
        }
    }, 300);
}

// Функция закрытия модального окна
function closeModal(modal) {
    if (!modal) return;
    
    // Удаляем класс active
    modal.classList.remove('active');
    
    // Разблокируем прокрутку body
    body.classList.remove('modal-open');
    
    // Устанавливаем aria-hidden в true
    modal.setAttribute('aria-hidden', 'true');
    
    // Сбрасываем активное модальное окно
    activeModal = null;
    
    // Создаем событие закрытия модального окна
    const closeEvent = new CustomEvent('modal:close', {
        detail: { modal }
    });
    modal.dispatchEvent(closeEvent);
}

// Обработчик клика на кнопки открытия
openButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = button.getAttribute('data-modal');
        openModal(modalId);
    });
});

// Обработчик клика на кнопки закрытия
closeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = button.closest('.modal');
        closeModal(modal);
    });
});

// Закрытие модального окна по клику на оверлей
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        const modal = e.target.closest('.modal');
        closeModal(modal);
    }
});

// Закрытие модального окна по клавише ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeModal) {
        closeModal(activeModal);
    }
});

// Закрытие модального окна по клавише Enter на кнопке закрытия
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.hasAttribute('data-close')) {
        e.preventDefault();
        const modal = e.target.closest('.modal');
        closeModal(modal);
    }
});

// Трап фокуса для доступности (управление Tab)
function trapFocus(modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
}

// Применяем трап фокуса ко всем модальным окнам
modals.forEach(modal => {
    trapFocus(modal);
});

// Обработка отправки формы (пример)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-primary')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            e.preventDefault();
            
            // Получаем данные формы
            const nameInput = modal.querySelector('#name');
            const emailInput = modal.querySelector('#email');
            
            const formData = {
                name: nameInput ? nameInput.value : '',
                email: emailInput ? emailInput.value : ''
            };
            
            // Выводим данные в консоль (здесь можно добавить отправку на сервер)
            console.log('Данные формы:', formData);
            
            // Закрываем модальное окно
            closeModal(modal);
            
            // Можно добавить уведомление об успешной отправке
            showNotification('Данные успешно сохранены!');
        }
    }
});

// Функция показа уведомления (опционально)
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Стили для уведомления
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#27ae60',
        color: 'white',
        padding: '15px 25px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'all 0.3s ease',
        fontSize: '14px',
        fontWeight: '500'
    });
    
    // Добавляем в DOM
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Обработка изменения размера окна (опционально)
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (activeModal) {
            // Если модальное окно открыто и мы на мобильном устройстве,
            // можно добавить дополнительную логику
            const isMobile = window.innerWidth <= 480;
            if (isMobile) {
                // Дополнительные действия для мобильных устройств
            }
        }
    }, 250);
});

// Предотвращение прокрутки страницы на iOS при открытом модальном окне
if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    document.addEventListener('touchmove', (e) => {
        if (activeModal && !e.target.closest('.modal-content')) {
            e.preventDefault();
        }
    }, { passive: false });
}

}
describe('Конструктор бургера', () => {
  beforeEach(() => {
    // Перехватываем запросы к API
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    // Устанавливаем токены авторизации
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
    cy.setCookie('accessToken', 'test-access-token');

    // Открываем страницу конструктора
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    // Очищаем токены после теста
    window.localStorage.removeItem('refreshToken');
    cy.clearCookies();
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавить булку в конструктор', () => {
      // Находим первую булку и кликаем на кнопку "Добавить"
      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем, что булка появилась в конструкторе (верх и низ)
      cy.contains('Краторная булка N-200i (верх)').should('be.visible');
      cy.contains('Краторная булка N-200i (низ)').should('be.visible');
    });

    it('должен добавить начинку в конструктор', () => {
      // Сначала добавляем булку
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем, что начинка появилась в конструкторе
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
    });

    it('должен добавить соус в конструктор', () => {
      // Сначала добавляем булку
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Переключаемся на вкладку "Соусы" если нужно
      cy.contains('Соусы').click();

      // Добавляем соус
      cy.contains('Соус Spicy-X').should('be.visible');
      cy.contains('Соус Spicy-X')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем, что соус появился в конструкторе
      cy.contains('Соус Spicy-X').should('be.visible');
    });
  });

  describe('Работа модальных окон', () => {
    it('должен открыть модальное окно ингредиента при клике', () => {
      // Кликаем на ингредиент
      cy.contains('Краторная булка N-200i').click();

      // Проверяем, что модальное окно открылось
      cy.contains('Детали ингредиента').should('be.visible');
      cy.contains('Краторная булка N-200i').should('be.visible');
    });

    it('должен закрыть модальное окно по клику на крестик', () => {
      // Открываем модальное окно
      cy.contains('Краторная булка N-200i').click();
      cy.url().should('include', '/ingredients/');
      cy.contains('Детали ингредиента').should('be.visible');

      // Закрываем модальное окно по клику на крестик
      // Ищем кнопку закрытия в модальном окне
      cy.get('#modals')
        .find('button[type="button"]')
        .should('be.visible')
        .click();

      // Ждем, пока URL вернется на главную страницу
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      
      // Проверяем, что модальное окно закрылось
      cy.contains('Детали ингредиента').should('not.exist');
    });

    it('должен закрыть модальное окно по клику на оверлей', () => {
      // Открываем модальное окно
      cy.contains('Краторная булка N-200i').click();
      cy.url().should('include', '/ingredients/');
      cy.contains('Детали ингредиента').should('be.visible');

      // Кликаем на оверлей
      // В структуре ModalUI оверлей рендерится последним (после модального окна)
      // Оверлей - это div с position: fixed, который покрывает весь экран
      cy.get('#modals').then(($modals) => {
        // Получаем все прямые дочерние элементы
        const children = Array.from($modals[0].children);
        // Оверлей обычно последний элемент (ModalOverlayUI рендерится после Modal)
        const overlay = children[children.length - 1] as HTMLElement;
        
        if (overlay) {
          // Проверяем, что это действительно оверлей (имеет нужные стили)
          const styles = window.getComputedStyle(overlay);
          if (styles.position === 'fixed') {
            // Кликаем на оверлей
            cy.wrap(overlay).click({ force: true });
          } else {
            // Если последний элемент не оверлей, ищем оверлей по стилям
            const foundOverlay = children.find((child: Element) => {
              const childStyles = window.getComputedStyle(child);
              return childStyles.position === 'fixed' && 
                     childStyles.top === '0px' &&
                     childStyles.left === '0px';
            });
            if (foundOverlay) {
              cy.wrap(foundOverlay).click({ force: true });
            } else {
              // Fallback: клик в углу экрана
              cy.get('body').click(0, 0, { force: true });
            }
          }
        } else {
          // Fallback: клик в углу экрана
          cy.get('body').click(0, 0, { force: true });
        }
      });

      // Ждем, пока URL вернется на главную страницу
      cy.url().should('eq', Cypress.config().baseUrl + '/');

      // Проверяем, что модальное окно закрылось
      cy.contains('Детали ингредиента').should('not.exist');
    });

    it('должен отображать данные именно того ингредиента, по которому произошел клик', () => {
      // Кликаем на первый ингредиент
      cy.contains('Краторная булка N-200i').click();
      cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');
      cy.contains('Детали ингредиента').should('be.visible');
      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.contains('420').should('be.visible'); // калории

      // Закрываем модальное окно
      cy.get('#modals')
        .find('button[type="button"]')
        .should('be.visible')
        .click();
      
      // Ждем, пока модальное окно закроется
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.contains('Детали ингредиента').should('not.exist');

      // Кликаем на другой ингредиент
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible').click();
      cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa0941');
      cy.contains('Детали ингредиента').should('be.visible');
      cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
      cy.contains('4242').should('be.visible'); // калории другого ингредиента
    });
  });

  describe('Создание заказа', () => {
    it('должен создать заказ и показать модальное окно с номером заказа', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Кликаем на кнопку "Оформить заказ"
      cy.contains('Оформить заказ').click();

      // Ждем запроса создания заказа
      cy.wait('@createOrder');

      // Проверяем, что модальное окно открылось с номером заказа
      cy.contains('12345').should('be.visible');
    });

    it('должен очистить конструктор после закрытия модального окна заказа', () => {
      // Добавляем булку
      cy.contains('Краторная булка N-200i')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Добавляем начинку
      cy.contains('Биокотлета из марсианской Магнолии')
        .parent()
        .find('button')
        .contains('Добавить')
        .click();

      // Проверяем, что ингредиенты добавлены в конструктор
      cy.contains('Краторная булка N-200i (верх)').should('be.visible');
      // Проверяем, что начинка в конструкторе - ищем в списке элементов конструктора
      // Находим кнопку "Оформить заказ" и идем от нее вверх к конструктору
      cy.contains('Оформить заказ')
        .parents('section')
        .contains('Биокотлета из марсианской Магнолии')
        .should('be.visible');

      // Кликаем на кнопку "Оформить заказ"
      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');

      // Проверяем, что модальное окно с номером заказа открылось
      cy.contains('12345').should('be.visible');

      // Закрываем модальное окно заказа
      cy.get('#modals')
        .find('button[type="button"]')
        .should('be.visible')
        .click();

      // Ждем, пока модальное окно закроется
      cy.contains('12345').should('not.exist');

      // Проверяем, что конструктор пуст - проверяем наличие плейсхолдеров
      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
      
      // Проверяем, что ингредиенты удалены из конструктора
      // Используем селектор через кнопку "Оформить заказ" для поиска секции конструктора
      cy.contains('Оформить заказ')
        .parents('section')
        .should('not.contain', 'Краторная булка N-200i (верх)');
      
      // Проверяем, что в списке элементов конструктора нет начинки
      cy.contains('Оформить заказ')
        .parents('section')
        .find('ul')
        .should('contain', 'Выберите начинку')
        .should('not.contain', 'Биокотлета из марсианской Магнолии');
    });
  });
});


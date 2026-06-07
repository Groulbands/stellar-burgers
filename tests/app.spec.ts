import { test, expect, Page } from '@playwright/test';

const mockUser = {
  success: true,
  user: {
    email: 'test@test.ru',
    name: 'Test User'
  }
};

const mockOrder = {
  success: true,
  name: 'Краторный бургер',
  order: {
    number: 12345
  }
};

const mockUserOrders = {
  success: true,
  orders: [
    {
      _id: '67c4b6b8b8b8b8b8b8b8b8b8',
      ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0940'],
      status: 'done',
      name: 'Флюоресцентный бургер',
      createdAt: '2026-01-01T12:00:00.000Z',
      updatedAt: '2026-01-01T12:00:00.000Z',
      number: 12345
    },
    {
      _id: '67c4b6b8b8b8b8b8b8b8b8b9',
      ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa0941'],
      status: 'pending',
      name: 'Краторный бургер',
      createdAt: '2026-01-01T13:00:00.000Z',
      updatedAt: '2026-01-01T13:00:00.000Z',
      number: 12346
    }
  ]
};

const mockFeedOrders = {
  success: true,
  orders: [
    {
      _id: '1',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0941'
      ],
      status: 'done',
      name: 'Краторный бургер',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      number: 12345
    }
  ],
  total: 1,
  totalToday: 1
};

async function mockAuth(page: Page) {
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'Bearer mock-access-token',
      domain: 'localhost',
      path: '/'
    }
  ]);

  await page.addInitScript(() => {
    window.localStorage.setItem('refreshToken', 'mock-refresh-token');
  });

  await page.route('**/api/auth/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUser)
    });
  });
}

async function clearAuth(page: Page) {
  await page.evaluate(() => {
    window.localStorage.removeItem('refreshToken');
  });

  await page.context().clearCookies();
}

async function mockCreateOrder(page: Page) {
  await page.route('**/api/orders', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOrder)
      });
    } else {
      await route.continue();
    }
  });
}

async function mockGetOrders(page: Page) {
  await page.route('**/api/orders', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUserOrders)
      });
    } else {
      await route.continue();
    }
  });
}



test.describe('Страница конструктора бургера', () => {
	test.beforeEach('загрузка ингредиентов из HAR', async ({ page }) => {
		await page.routeFromHAR('./tests/hars/ingredients.har', {
			url: '**/api/ingredients',
			update: false,
		});

		await page.goto('/');

		await expect(page.getByTestId('loading')).not.toBeVisible();
	});

  test('должен добавить булку в конструктор', async ({ page }) => {
    const bunName = 'Краторная булка N-200i';

    const bunCard = page.locator('li').filter({
      hasText: bunName,
    }).first();

    await bunCard.getByRole('button', { name: /добавить/i }).click();

    await expect(page.getByTestId('constructor-bun-top')).toContainText(bunName);

    await expect(page.getByTestId('constructor-bun-bottom')).toContainText(bunName);
  })

  test('должен добавить начинку в конструктор', async ({ page }) => {
    const ingredientName = 'Биокотлета из марсианской Магнолии';

    const ingredientCard = page.locator('li').filter({
      hasText: ingredientName,
    }).first();

    await ingredientCard.getByRole('button', { name: /добавить/i }).click();

    await expect(page.getByTestId('constructor-ingredients')).toContainText(ingredientName);
  });

  test('должен открыть и закрыть модалку ингредиента', async ({ page }) => {
    const bunName = 'Краторная булка N-200i';

    const bunCard = page.locator('li').filter({
      hasText: bunName,
    }).first();

    await bunCard.getByRole('link', { name: `${bunName}`}).click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal')).toContainText(bunName);
    await page.getByTestId('modal_close').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();

    
    await bunCard.getByRole('link', { name: `${bunName}`}).click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal')).toContainText(bunName);
    await page.getByTestId('modal_overlay').click({
      position: { x:10, y:10 },
    });
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('должен открыть и закрыть модалку заказа в ленте заказов', async ({ page }) => {
    await page.route('**/api/orders/all', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockFeedOrders)
      });
    });

    await page.goto('/feed');

    const orderCard = page.getByTestId('order_card').first();


    await orderCard.click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal')).toContainText('Детали заказа');
    await page.getByTestId('modal_close').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();

    
    await orderCard.click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal')).toContainText('Детали заказа');
    await page.getByTestId('modal_overlay').click({
      position: { x:10, y:10 },
    });
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('должен открыть и закрыть модалку заказа в профиле', async ({ page }) => {
    await mockAuth(page);
    await mockGetOrders(page);

    await page.goto('/profile/orders');

    await expect(page.getByTestId('loading')).not.toBeVisible();

    const orderCard = page.getByTestId('order_card').first();
    await expect(orderCard).toBeVisible();
    await orderCard.click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal')).toContainText('Детали заказа');
    await page.getByTestId('modal_close').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();

    await expect(orderCard).toBeVisible();
    await orderCard.click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal')).toContainText('Детали заказа');
    await page.getByTestId('modal_overlay').click({
      position: { x:10, y:10 },
    });
    await expect(page.getByTestId('modal')).not.toBeVisible();
    await clearAuth(page);
  });


  test('должен оформить заказ, показать номер заказа и очистить конструктор', async ({ page }) => {
    await mockAuth(page);
    await mockCreateOrder(page);

    await page.goto('/');

    await expect(page.getByTestId('loading')).not.toBeVisible();

    const bunName = 'Краторная булка N-200i';
    const ingredientName = 'Биокотлета из марсианской Магнолии';

    const bunCard = page.locator('li').filter({
      hasText: bunName
    }).first();

    const ingredientCard = page.locator('li').filter({
      hasText: ingredientName
    }).first();

    await bunCard.getByRole('button', { name: /добавить/i }).click();
    await ingredientCard.getByRole('button', { name: /добавить/i }).click();

    await expect(page.getByTestId('constructor-bun-top')).toContainText(bunName);
    await expect(page.getByTestId('constructor-bun-bottom')).toContainText(bunName);
    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      ingredientName
    );

    await page.getByRole('button', { name: /оформить заказ/i }).click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal')).toContainText('12345');

    await expect(page.getByTestId('constructor-bun-top')).not.toBeVisible();
    await expect(page.getByTestId('constructor-bun-bottom')).not.toBeVisible();
    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      'Выберите начинку'
    );

    await expect(page.getByText('Выберите булки')).toHaveCount(2);
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await page.getByTestId('modal_close').click();

    await expect(page.getByTestId('modal')).not.toBeVisible();

    await clearAuth(page);
  });
})

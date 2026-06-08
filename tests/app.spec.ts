import { expect, Page, test } from '@playwright/test';

const INGREDIENTS = {
  bun: {
    name: 'Краторная булка N-200i',
    calories: '420',
    proteins: '80',
    fat: '24',
    carbohydrates: '53'
  },
  main: {
    name: 'Биокотлета из марсианской Магнолии'
  }
};

const ORDER_NUMBER = '12345';

const getIngredientCard = (page: Page, ingredientName: string) =>
  page.locator('li').filter({ hasText: ingredientName }).first();

const addIngredientToConstructor = async (page: Page, ingredientName: string) => {
  await getIngredientCard(page, ingredientName)
    .getByRole('button', { name: /добавить/i })
    .click();
};

const setAuthTokens = async (page: Page) => {
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'Bearer mock-access-token',
      url: 'http://localhost:4000'
    }
  ]);

  await page.addInitScript(() => {
    window.localStorage.setItem('refreshToken', 'mock-refresh-token');
  });
};

const clearAuthTokens = async (page: Page) => {
  await page.evaluate(() => {
    window.localStorage.removeItem('refreshToken');
    document.cookie = 'accessToken=; Max-Age=0; path=/';
  });

  await page.context().clearCookies();
};

test.describe('Страница конструктора бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('./tests/hars/api.har', {
      url: '**/api/**',
      update: false,
      notFound: 'abort'
    });

    await page.goto('/');
    await expect(page.getByTestId('loading')).not.toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await clearAuthTokens(page);
  });

  test('добавляет булку из списка ингредиентов в конструктор', async ({ page }) => {
    await addIngredientToConstructor(page, INGREDIENTS.bun.name);

    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      INGREDIENTS.bun.name
    );
    await expect(page.getByTestId('constructor-bun-bottom')).toContainText(
      INGREDIENTS.bun.name
    );
  });

  test('добавляет начинку из списка ингредиентов в конструктор', async ({ page }) => {
    await addIngredientToConstructor(page, INGREDIENTS.main.name);

    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      INGREDIENTS.main.name
    );
  });

  test('открывает и закрывает модальное окно с описанием ингредиента', async ({ page }) => {
    await getIngredientCard(page, INGREDIENTS.bun.name)
      .getByRole('link', { name: INGREDIENTS.bun.name })
      .click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal')).toContainText(INGREDIENTS.bun.name);

    await page.getByTestId('modal_close').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();

    await getIngredientCard(page, INGREDIENTS.bun.name)
      .getByRole('link', { name: INGREDIENTS.bun.name })
      .click();
    await page.getByTestId('modal_overlay').click({
      position: { x: 10, y: 10 },
    });
    await expect(page.getByTestId('modal')).not.toBeVisible();
  });

  test('показывает в модальном окне данные выбранного ингредиента', async ({ page }) => {
    await getIngredientCard(page, INGREDIENTS.bun.name)
      .getByRole('link', { name: INGREDIENTS.bun.name })
      .click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal')).toContainText(INGREDIENTS.bun.name);
    await expect(page.getByTestId('modal')).toContainText(
      INGREDIENTS.bun.calories
    );
    await expect(page.getByTestId('modal')).toContainText(
      INGREDIENTS.bun.proteins
    );
    await expect(page.getByTestId('modal')).toContainText(INGREDIENTS.bun.fat);
    await expect(page.getByTestId('modal')).toContainText(
      INGREDIENTS.bun.carbohydrates
    );
  });

  test('оформляет заказ, показывает номер заказа и очищает конструктор', async ({ page }) => {
    await setAuthTokens(page);
    await page.goto('/');
    await expect(page.getByTestId('loading')).not.toBeVisible();

    await addIngredientToConstructor(page, INGREDIENTS.bun.name);
    await addIngredientToConstructor(page, INGREDIENTS.main.name);

    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      INGREDIENTS.bun.name
    );
    await expect(page.getByTestId('constructor-bun-bottom')).toContainText(
      INGREDIENTS.bun.name
    );
    await expect(page.getByTestId('constructor-ingredients')).toContainText(
      INGREDIENTS.main.name
    );

    await page.getByRole('button', { name: /оформить заказ/i }).click();

    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('modal')).toContainText(ORDER_NUMBER);

    await page.getByTestId('modal_close').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();

    await expect(page.getByTestId('constructor-bun-top')).not.toBeVisible();
    await expect(page.getByTestId('constructor-bun-bottom')).not.toBeVisible();
    await expect(page.getByText('Выберите булки')).toHaveCount(2);
    await expect(page.getByText('Выберите начинку')).toBeVisible();
  });
});

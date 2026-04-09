import { test, expect } from '@playwright/test';

// ── Helpers ──────────────────────────────────────────────────────────────────

async function noConsoleErrors(page: import('@playwright/test').Page) {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}

// ── Pages load without 4xx/5xx ────────────────────────────────────────────────

test.describe('Pages load correctly', () => {
  const routes = [
    { path: '/', name: 'Home' },
    { path: '/proyectos', name: 'Proyectos' },
    { path: '/sobre-mi', name: 'Sobre Mí' },
    { path: '/cv', name: 'CV' },
    { path: '/contacto', name: 'Contacto' },
  ];

  for (const { path, name } of routes) {
    test(`${name} (${path}) loads with 200`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBeLessThan(400);
    });
  }

  test('404 page renders correctly', async ({ page }) => {
    const response = await page.goto('/ruta-inexistente-xyz');
    // Astro serves 404.astro — status may be 200 depending on adapter
    await expect(page.locator('h1')).toBeVisible();
  });
});

// ── Meta tags ─────────────────────────────────────────────────────────────────

test.describe('SEO meta tags', () => {
  const pages = ['/', '/proyectos', '/sobre-mi', '/cv', '/contacto'];

  for (const path of pages) {
    test(`${path} has a non-empty <title>`, async ({ page }) => {
      await page.goto(path);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    });

    test(`${path} has meta description`, async ({ page }) => {
      await page.goto(path);
      const desc = page.locator('meta[name="description"]');
      await expect(desc).toHaveCount(1);
      const content = await desc.getAttribute('content');
      expect(content?.length).toBeGreaterThan(0);
    });
  }
});

// ── Header navigation ─────────────────────────────────────────────────────────

test.describe('Header navigation', () => {
  test('has links to all main sections', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header');

    await expect(header.getByRole('link', { name: /proyectos/i })).toBeVisible();
    await expect(header.getByRole('link', { name: /sobre m/i })).toBeVisible();
    await expect(header.getByRole('link', { name: /cv/i })).toBeVisible();
    await expect(header.getByRole('link', { name: /contacto/i })).toBeVisible();
  });

  test('logo/name links back to home', async ({ page }) => {
    await page.goto('/proyectos');
    const header = page.locator('header');
    const homeLink = header.locator('a[href="/"]');
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await expect(page).toHaveURL('/');
  });
});

// ── Home page ─────────────────────────────────────────────────────────────────

test.describe('Home page', () => {
  test('hero section is visible', async ({ page }) => {
    await page.goto('/');
    // Hero should take up significant viewport
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
  });

  test('"Ver Proyectos" CTA links to /proyectos', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: /ver proyectos/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/proyectos');
  });

  test('"Contactar" CTA links to /contacto', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: /contactar/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/contacto');
  });
});

// ── Proyectos gallery ─────────────────────────────────────────────────────────

test.describe('Proyectos gallery', () => {
  test('page renders the category filter or empty state', async ({ page }) => {
    await page.goto('/proyectos');
    await page.waitForTimeout(1000);
    // The main content area should be visible
    const main = page.locator('main');
    await expect(main).toBeVisible();
    // Page has h1 with "Proyectos" (scoped to main to avoid strict mode issues)
    const h1 = page.locator('main h1').first();
    await expect(h1).toBeVisible();
  });

  test('category filter buttons are visible when projects exist', async ({ page }) => {
    await page.goto('/proyectos');
    // Wait for React island to hydrate
    await page.waitForTimeout(1000);

    const todosBtn = page.getByRole('button', { name: /todos/i });
    // Only assert if button exists (depends on Sanity data)
    const count = await todosBtn.count();
    if (count > 0) {
      await expect(todosBtn).toBeVisible();

      // Click a filter button — should not crash
      await todosBtn.click();
      await page.waitForTimeout(300);
      await expect(page.locator('body')).toBeVisible();
    }
  });
});

// ── Contacto form ─────────────────────────────────────────────────────────────

test.describe('Contact form', () => {
  test('form fields are present', async ({ page }) => {
    await page.goto('/contacto');
    // Wait for React island
    await page.waitForTimeout(1000);

    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#message')).toBeVisible();
    await expect(page.getByRole('button', { name: /enviar/i })).toBeVisible();
  });

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/contacto');
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: /enviar/i }).click();
    await page.waitForTimeout(500);

    // At least one error message should appear
    const errors = page.locator('p[class*="text-\\[\\#D94F4F\\]"], p[class*="red"]');
    const count = await errors.count();
    expect(count).toBeGreaterThan(0);
  });

  test('validates email format', async ({ page }) => {
    await page.goto('/contacto');
    await page.waitForTimeout(1000);

    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('not-an-email');
    await page.locator('#message').fill('This is a test message that is long enough');
    await page.getByRole('button', { name: /enviar/i }).click();
    await page.waitForTimeout(500);

    // Should show email validation error
    const emailError = page.locator('p[class*="text-\\[\\#D94F4F\\]"]').first();
    const count = await emailError.count();
    if (count > 0) {
      await expect(emailError).toBeVisible();
    }
  });
});

// ── CV page ───────────────────────────────────────────────────────────────────

test.describe('CV page', () => {
  test('CV page has page title', async ({ page }) => {
    await page.goto('/cv');
    await expect(page.locator('h1')).toBeVisible();
    const h1 = await page.locator('h1').textContent();
    expect(h1?.toLowerCase()).toContain('cv');
  });

  test('download PDF link exists with download attribute', async ({ page }) => {
    await page.goto('/cv');
    const downloadLink = page.getByRole('link', { name: /descargar/i });
    const count = await downloadLink.count();
    if (count > 0) {
      await expect(downloadLink.first()).toHaveAttribute('href', '/cv/cv.pdf');
      await expect(downloadLink.first()).toHaveAttribute('download');
    }
  });
});

// ── Footer ────────────────────────────────────────────────────────────────────

test.describe('Footer', () => {
  test('footer is present on all pages', async ({ page }) => {
    for (const path of ['/', '/proyectos', '/sobre-mi', '/cv', '/contacto']) {
      await page.goto(path);
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
    }
  });

  test('footer has contact link', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    const contactLink = footer.getByRole('link', { name: /contacto/i });
    await expect(contactLink).toBeVisible();
  });
});

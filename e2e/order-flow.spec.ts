import { expect, test } from "@playwright/test";

test.describe("order flow", () => {
  test("catalog -> cart -> checkout contact step", async ({ page }) => {
    await page.goto("/en/catalog");

    await page.getByRole("link", { name: "Customize & Order" }).first().click();
    await expect(page).toHaveURL(/\/en\/catalog\/\w+/);

    const deliveryDate = page.locator("#delivery-date");
    await deliveryDate.waitFor({ state: "visible" });

    const minDate = (await deliveryDate.getAttribute("min")) ?? "2030-01-01";
    await deliveryDate.fill(minDate);

    await page.getByRole("button", { name: "Add to Cart" }).click();
    await expect(page.getByRole("button", { name: "Added to Cart!" })).toBeVisible();

    await page.goto("/en/cart");
    await expect(page.getByRole("heading", { name: "Your Cart" })).toBeVisible();

    await page.getByRole("link", { name: "Proceed to Checkout" }).click();
    await expect(page).toHaveURL(/\/en\/checkout/);
    await expect(page.getByRole("heading", { name: "Contact Information" })).toBeVisible();

    await page.locator("#checkout-first-name").fill("John");
    await page.locator("#checkout-last-name").fill("Doe");
    await page.locator("#checkout-phone").fill("9165551234");
    await page.locator("#checkout-email").fill("john@example.com");

    await page.getByRole("button", { name: "Continue" }).click();

    await expect(page.getByRole("heading", { name: "Delivery Details" })).toBeVisible();
  });
});

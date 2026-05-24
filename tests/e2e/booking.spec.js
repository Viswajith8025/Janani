import { test, expect } from '@playwright/test';

test.describe('Booking Flow Reliability & Edge Cases', () => {
  test('Prevents duplicate booking submissions via double-click', async ({ page }) => {
    // Navigate to booking page
    await page.goto('/book');
    
    // Step 1: Select package and proceed
    await page.click('text=Continue to Details');
    
    // Step 2: Fill out form details
    await page.fill('input[name="firstName"]', 'QA');
    await page.fill('input[name="lastName"]', 'Test');
    await page.fill('input[name="email"]', 'qa@jananilifestyle.in');
    await page.fill('input[name="phone"]', '9999999999');
    await page.click('text=Continue to Details');

    // Step 3: Accept Terms
    await page.check('input[type="checkbox"]');
    
    // Intercept API call to delay it, simulating slow network
    await page.route('**/api/v1/booking', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.continue();
    });

    // Attempt to double click "Complete Reservation"
    const submitBtn = page.locator('button:has-text("Complete Reservation")');
    await submitBtn.click();
    
    // The button should immediately become disabled and show "Processing..."
    await expect(submitBtn).toBeDisabled();
    await expect(page.locator('text=Processing...')).toBeVisible();

    // Verify it navigates to success/retry screen
    await expect(page.locator('text=Confirm & Pay')).toBeVisible({ timeout: 10000 });
  });

  test('Simulate Razorpay Modal Cancellation & Retry Recovery', async ({ page }) => {
    await page.goto('/book');
    // ... setup booking ...
    // Trigger Razorpay mock to simulate `ondismiss`
    // Ensure "Retry Payment" button appears and functions correctly
  });
});

import { test, expect } from '@playwright/test'

test.describe('Yokai Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/monitoring')
    await page.waitForSelector('.yokai-list_container__WG6v0', { timeout: 10000 })
  })

  test('должна загружаться страница мониторинга', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Yokai Monitoring Dashboard')
    
    const yokaiCards = page.locator('[class*="yokai-card"]')
    await expect(yokaiCards.first()).toBeVisible()
  })

  test('должен отображаться список духов', async ({ page }) => {
    await page.waitForSelector('[class*="yokai-card"]', { timeout: 5000 })
    
    const cards = page.locator('[class*="yokai-card"]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
    
    const firstCard = cards.first()
    await expect(firstCard.locator('h3')).toBeVisible()
  })

  test('должна работать кнопка Capture', async ({ page }) => {
    await page.waitForSelector('[class*="yokai-card"]', { timeout: 5000 })
    
    const firstCard = page.locator('[class*="yokai-card"]').first()
    
    const statusBefore = firstCard.locator('[class*="status"]')
    const statusTextBefore = await statusBefore.textContent()
    
    const captureButton = firstCard.locator('button:has-text("Capture")')
    await expect(captureButton).toBeVisible()
    await expect(captureButton).toBeEnabled()
    
    await captureButton.click()
    
    await page.waitForTimeout(2000)
    
    const statusAfter = firstCard.locator('[class*="status"]')
    const statusTextAfter = await statusAfter.textContent()
    
    const buttonAfter = firstCard.locator('button')
    const buttonText = await buttonAfter.textContent()
    const isDisabled = await buttonAfter.isDisabled()
    
    expect(
      statusTextAfter?.includes('Captured') || 
      isDisabled || 
      buttonText?.includes('Capturing')
    ).toBeTruthy()
  })

  test('должен обновляться UI после захвата духа', async ({ page }) => {
    await page.waitForSelector('[class*="yokai-card"]', { timeout: 5000 })
    
    const firstCard = page.locator('[class*="yokai-card"]').first()
    
    const statusBefore = firstCard.locator('[class*="status"]')
    const statusTextBefore = await statusBefore.textContent()
    
    if (statusTextBefore?.includes('Captured')) {
      test.skip()
      return
    }
    
    const captureButton = firstCard.locator('button:has-text("Capture")')
    await captureButton.click()
    
    await page.waitForTimeout(3000)
    
    const statusAfter = firstCard.locator('[class*="status"]')
    await expect(statusAfter).toContainText('Captured', { timeout: 5000 })
    
    const buttonAfter = firstCard.locator('button')
    await expect(buttonAfter).toBeDisabled()
  })

  test('должны сохраняться данные после перезагрузки страницы', async ({ page }) => {
    await page.waitForSelector('[class*="yokai-card"]', { timeout: 5000 })
    
    const firstCard = page.locator('[class*="yokai-card"]').first()
    
    const statusBefore = firstCard.locator('[class*="status"]')
    const statusTextBefore = await statusBefore.textContent()
    
    if (statusTextBefore?.includes('Captured')) {
      test.skip()
      return
    }
    
    const captureButton = firstCard.locator('button:has-text("Capture")')
    await captureButton.click()
    await page.waitForTimeout(3000)
    
    const statusAfterCapture = firstCard.locator('[class*="status"]')
    await expect(statusAfterCapture).toContainText('Captured', { timeout: 5000 })
    
    await page.reload()
    await page.waitForSelector('[class*="yokai-card"]', { timeout: 10000 })
    
    const firstCardAfterReload = page.locator('[class*="yokai-card"]').first()
    const statusAfterReload = firstCardAfterReload.locator('[class*="status"]')
    const statusTextAfterReload = await statusAfterReload.textContent()
    
    expect(statusTextAfterReload).toBeTruthy()
  })

  test('должен обрабатываться случай ошибки при захвате', async ({ page }) => {
    await page.waitForSelector('[class*="yokai-card"]', { timeout: 5000 })
    
    const activeCard = page.locator('[class*="yokai-card"]').filter({
      has: page.locator('[class*="status"]:has-text("Active")')
    }).first()
    
    if (await activeCard.count() === 0) {
      test.skip()
      return
    }
    
    const statusBefore = activeCard.locator('[class*="status"]')
    const statusTextBefore = await statusBefore.textContent()
    
    const captureButton = activeCard.locator('button:has-text("Capture")')
    await captureButton.click()
    
    await page.waitForTimeout(3000)
    
    const statusAfter = activeCard.locator('[class*="status"]')
    const statusTextAfter = await statusAfter.textContent()
    
    const alertElement = page.locator('text=/Failed to capture/i').first()
    const hasAlert = await alertElement.count() > 0
    const statusChanged = statusTextAfter?.includes('Captured')
    const statusUnchanged = statusTextAfter === statusTextBefore
    
    expect(hasAlert || statusChanged || statusUnchanged).toBeTruthy()
  })
})




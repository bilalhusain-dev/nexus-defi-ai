import os
import time
from playwright.sync_api import sync_playwright

os.makedirs('tests/output', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 720})
    page.goto('http://localhost:3000')
    page.wait_for_timeout(1000)

    # 1. Main Terminal (Perp mode)
    page.screenshot(path='tests/output/view_1_perp_terminal.png')
    print('1. Saved tests/output/view_1_perp_terminal.png')

    # 2. Spot Swap
    page.click('#btnModeSpot')
    page.wait_for_timeout(400)
    page.screenshot(path='tests/output/view_2_spot_swap.png')
    print('2. Saved tests/output/view_2_spot_swap.png')

    # 3. DCA Plan
    page.click('#btnModeDca')
    page.wait_for_timeout(400)
    page.screenshot(path='tests/output/view_3_dca_plan.png')
    print('3. Saved tests/output/view_3_dca_plan.png')

    # 4. Trigger trade execution toast in Spot Swap
    page.click('#btnModeSpot')
    page.wait_for_timeout(200)
    page.click('#btnSubmitOrderAction')
    page.wait_for_timeout(500)
    page.screenshot(path='tests/output/view_4_toast_notification.png')
    print('4. Saved tests/output/view_4_toast_notification.png')

    # 5. Whale Radar
    page.click('#navItemWhale')
    page.wait_for_timeout(400)
    page.screenshot(path='tests/output/view_5_whale_radar.png')
    print('5. Saved tests/output/view_5_whale_radar.png')

    # 6. AI Alpha
    page.click('#navItemAi')
    page.wait_for_timeout(400)
    page.screenshot(path='tests/output/view_6_ai_alpha.png')
    print('6. Saved tests/output/view_6_ai_alpha.png')

    # 7. Light Theme
    page.click('#themeIconBtn')
    page.wait_for_timeout(600)
    page.screenshot(path='tests/output/view_7_light_theme.png')
    print('7. Saved tests/output/view_7_light_theme.png')

    browser.close()

print('ALL TESTS COMPLETED SUCCESSFULLY!')

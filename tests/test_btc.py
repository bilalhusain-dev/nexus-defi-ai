import os
from playwright.sync_api import sync_playwright

os.makedirs('tests/output', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 720})
    page.goto('http://localhost:3000')
    page.wait_for_timeout(1000)

    # Open Pair Modal
    page.click('.market-pair-button')
    page.wait_for_timeout(400)
    page.screenshot(path='tests/output/view_8_pair_modal.png')
    print('8. Saved tests/output/view_8_pair_modal.png')

    # Select BTC
    page.click("text=BTC / USDT")
    page.wait_for_timeout(600)
    page.screenshot(path='tests/output/view_9_btc_market.png')
    print('9. Saved tests/output/view_9_btc_market.png')

    browser.close()

print('BTC TEST SUCCESS!')

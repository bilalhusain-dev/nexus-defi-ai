import os
from playwright.sync_api import sync_playwright

os.makedirs('tests/output', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 720})
    page.goto('http://localhost:3000')
    page.wait_for_timeout(3000)

    # Click pair modal
    page.click('.market-pair-button')
    page.wait_for_timeout(500)

    # Choose BTC
    page.click("text=BTC / USDT")
    page.wait_for_timeout(5000)

    page.screenshot(path='tests/output/tv_btc_market_check.png')
    print('Saved tests/output/tv_btc_market_check.png')

    ticker_price = page.inner_text('#tickerMarkPrice')
    print('BTC Ticker Mark Price:', ticker_price)

    browser.close()

print('BTC TV TEST SUCCESSFUL!')

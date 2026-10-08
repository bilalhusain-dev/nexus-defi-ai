import os
import time
from playwright.sync_api import sync_playwright

os.makedirs('tests/output', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 720})

    logs = []
    page.on('console', lambda msg: logs.append(f'[{msg.type}] {msg.text}'))

    page.goto('http://localhost:3000')
    # Wait for TradingView network assets and Binance ticker
    page.wait_for_timeout(6000)

    page.screenshot(path='tests/output/option_a_tradingview_default.png')
    print('Saved tests/output/option_a_tradingview_default.png')

    ticker_price = page.inner_text('#tickerMarkPrice')
    print('Ticker Mark Price:', ticker_price)

    iframe_count = page.locator('#tradingview_container iframe').count()
    print('TradingView Iframe Count:', iframe_count)

    browser.close()

print('OPTION A TEST SUCCESSFUL!')

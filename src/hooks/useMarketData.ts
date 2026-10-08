import { useState, useEffect } from 'react';
import { OrderBookEntry, RecentTrade, AISignal, WhaleAlert } from '../types/web3';

export function useMarketData(basePair: string = 'ETH/USDT') {
  const [currentPrice, setCurrentPrice] = useState(3482.50);
  const [priceChange24h, setPriceChange24h] = useState(3.42);
  const [high24h, setHigh24h] = useState(3540.20);
  const [low24h, setLow24h] = useState(3395.10);
  const [volume24hUSD, setVolume24hUSD] = useState(1482900450);

  // Live Order Book Data (12 Bids, 12 Asks)
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [recentTrades, setRecentTrades] = useState<RecentTrade[]>([]);

  // AI-Driven Trading Signals
  const [aiSignals] = useState<AISignal[]>([
    {
      id: 'sig_1',
      pair: 'ETH/USDT',
      side: 'LONG',
      entryPrice: 3480.00,
      targetPrice: 3650.00,
      stopLoss: 3390.00,
      confidenceScore: 92,
      timeframe: '4h',
      rationale: 'Bullish divergence detected across 4H RSI + smart-money net inflow of 18.4K ETH across Layer 2 bridges.',
      onChainMetrics: {
        whaleAccumulation: '+14.2% (24h)',
        fundingRate: '+0.0082% (Neutral/Bullish)',
        orderFlowImbalance: '68% Bid Dominance',
      },
    },
    {
      id: 'sig_2',
      pair: 'WBTC/USDT',
      side: 'LONG',
      entryPrice: 67800.00,
      targetPrice: 71200.00,
      stopLoss: 66100.00,
      confidenceScore: 88,
      timeframe: '1d',
      rationale: 'Institutional custody outflows from Coinbase Prime indicating structural accumulation prior to weekly options expiry.',
      onChainMetrics: {
        whaleAccumulation: '+8.7% (24h)',
        fundingRate: '+0.0105%',
        orderFlowImbalance: '72% Net Buy',
      },
    },
    {
      id: 'sig_3',
      pair: 'ARB/USDT',
      side: 'SHORT',
      entryPrice: 1.30,
      targetPrice: 1.14,
      stopLoss: 1.36,
      confidenceScore: 78,
      timeframe: '1h',
      rationale: 'Overextended perp delta with 4.8M token unlock vesting release in 36 hours.',
      onChainMetrics: {
        whaleAccumulation: '-3.1% (Outflow)',
        fundingRate: '+0.0340% (Overheated)',
        orderFlowImbalance: '59% Ask Pressure',
      },
    },
  ]);

  // Real-Time Whale Tracker Data
  const [whaleAlerts, setWhaleAlerts] = useState<WhaleAlert[]>([
    {
      id: 'wh_1',
      timestamp: Date.now() - 45000,
      sender: '0x3845badAde8e6dFF049820680d418274cf95F82d',
      receiver: '0x1111111254fb6c44bac0bed2854e76f90643097d',
      action: 'SWAP',
      amount: '450.0 ETH',
      tokenSymbol: 'ETH',
      valueUSD: 1567125,
      destinationName: '1inch Liquidity Router',
      txHash: '0x9a8f4c2e1b3d5a7e9f0c2b4d6e8a1c3e5f7b9a2d4e6f8a0c2b4d6e8a1c3e5f7b',
    },
    {
      id: 'wh_2',
      timestamp: Date.now() - 180000,
      sender: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      receiver: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
      action: 'DEPOSIT',
      amount: '1,200.0 ETH',
      tokenSymbol: 'stETH',
      valueUSD: 4179000,
      destinationName: 'Lido Liquid Staking',
      txHash: '0x3c2e1b4a5f6d7e8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a',
    },
    {
      id: 'wh_3',
      timestamp: Date.now() - 360000,
      sender: '0x28C6c06298d514Db089934071355E5743bf21d60',
      receiver: '0x912CE59144191C1204E64559FE8253a0e49E6548',
      action: 'WITHDRAW',
      amount: '1,850,000 ARB',
      tokenSymbol: 'ARB',
      valueUSD: 2368000,
      destinationName: 'Binance Hot Wallet #6',
      txHash: '0x5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c',
    },
  ]);

  // Generate initial order book
  useEffect(() => {
    const base = currentPrice;
    const initialAsks: OrderBookEntry[] = [];
    const initialBids: OrderBookEntry[] = [];

    let cumAsk = 0;
    for (let i = 8; i >= 1; i--) {
      const price = +(base + i * 0.45).toFixed(2);
      const amount = +(Math.random() * 2.8 + 0.3).toFixed(3);
      cumAsk += amount;
      initialAsks.push({
        price,
        amount,
        total: +cumAsk.toFixed(3),
        depthPercentage: Math.min(100, Math.round((cumAsk / 25) * 100)),
      });
    }

    let cumBid = 0;
    for (let i = 1; i <= 8; i++) {
      const price = +(base - i * 0.45).toFixed(2);
      const amount = +(Math.random() * 3.2 + 0.4).toFixed(3);
      cumBid += amount;
      initialBids.push({
        price,
        amount,
        total: +cumBid.toFixed(3),
        depthPercentage: Math.min(100, Math.round((cumBid / 25) * 100)),
      });
    }

    setAsks(initialAsks);
    setBids(initialBids);

    // Initial trades
    setRecentTrades([
      { id: 't1', timestamp: Date.now() - 2000, price: base + 0.1, amount: 0.85, side: 'buy', txHash: '0x4f...12a' },
      { id: 't2', timestamp: Date.now() - 4000, price: base - 0.2, amount: 1.40, side: 'sell', txHash: '0x8b...43c' },
      { id: 't3', timestamp: Date.now() - 6500, price: base + 0.15, amount: 0.42, side: 'buy', txHash: '0x9c...ef1' },
      { id: 't4', timestamp: Date.now() - 9000, price: base, amount: 2.10, side: 'buy', txHash: '0x1a...88d' },
      { id: 't5', timestamp: Date.now() - 12000, price: base - 0.3, amount: 0.95, side: 'sell', txHash: '0x3e...77f' },
    ]);
  }, []);

  // Periodic Micro-Tick Simulation for Real-Time Feel
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.49) * 0.8;
      setCurrentPrice((prev) => +(prev + delta).toFixed(2));

      // Append new trade occasionally
      if (Math.random() > 0.4) {
        const side: 'buy' | 'sell' = Math.random() > 0.5 ? 'buy' : 'sell';
        const tradePrice = +(currentPrice + (side === 'buy' ? 0.2 : -0.2)).toFixed(2);
        const tradeAmount = +(Math.random() * 1.5 + 0.1).toFixed(3);

        setRecentTrades((prev) => [
          {
            id: 't_' + Date.now(),
            timestamp: Date.now(),
            price: tradePrice,
            amount: tradeAmount,
            side,
            txHash: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}` as `0x${string}`,
          },
          ...prev.slice(0, 14),
        ]);
      }
    }, 2200);

    return () => clearInterval(interval);
  }, [currentPrice]);

  return {
    currentPrice,
    priceChange24h,
    high24h,
    low24h,
    volume24hUSD,
    bids,
    asks,
    recentTrades,
    aiSignals,
    whaleAlerts,
  };
}

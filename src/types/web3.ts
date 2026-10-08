export type ChainId = 1 | 42161 | 137 | 56;

export interface Network {
  id: string;
  name: string;
  chainId: ChainId;
  icon: string;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockTimeMs: number;
  isTestnet?: boolean;
}

export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address: `0x${string}`;
  logoURI: string;
  balance?: string;
  priceUSD: number;
  change24h: number;
  verified: boolean;
}

export interface SwapQuote {
  inputToken: Token;
  outputToken: Token;
  inputAmount: string;
  outputAmount: string;
  executionPrice: number;
  priceImpact: number;
  minimumReceived: string;
  slippageTolerance: number;
  estimatedGasUSD: number;
  route: {
    protocol: string;
    percentage: number;
    poolFee: string;
  }[];
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
  depthPercentage: number;
}

export interface RecentTrade {
  id: string;
  timestamp: number;
  price: number;
  amount: number;
  side: 'buy' | 'sell';
  txHash: `0x${string}`;
}

export interface AISignal {
  id: string;
  pair: string;
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  confidenceScore: number; // 0-100
  timeframe: '15m' | '1h' | '4h' | '1d';
  rationale: string;
  onChainMetrics: {
    whaleAccumulation: string;
    fundingRate: string;
    orderFlowImbalance: string;
  };
}

export interface WhaleAlert {
  id: string;
  timestamp: number;
  sender: `0x${string}`;
  receiver: `0x${string}`;
  action: 'DEPOSIT' | 'WITHDRAW' | 'SWAP' | 'LIQUIDATION';
  amount: string;
  tokenSymbol: string;
  valueUSD: number;
  destinationName: string;
  txHash: `0x${string}`;
}

export interface StakingVault {
  id: string;
  name: string;
  stakeToken: Token;
  rewardToken: Token;
  apy: number;
  tvlUSD: number;
  lockDurationDays: number;
  userStaked: string;
  userRewards: string;
  status: 'ACTIVE' | 'DEPRECATED';
}

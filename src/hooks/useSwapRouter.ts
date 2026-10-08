import { useState, useMemo, useCallback } from 'react';
import { Token, SwapQuote } from '../types/web3';
import { VERIFIED_TOKENS } from '../config/networks';

export type SwapStep = 'IDLE' | 'APPROVING' | 'APPROVED' | 'SIGNING' | 'CONFIRMING' | 'SUCCESS' | 'ERROR';

export function useSwapRouter() {
  const [inputToken, setInputToken] = useState<Token>(VERIFIED_TOKENS[0]); // ETH
  const [outputToken, setOutputToken] = useState<Token>(VERIFIED_TOKENS[2]); // USDT
  const [inputAmount, setInputAmount] = useState<string>('1.0');
  const [slippage, setSlippage] = useState<number>(0.5); // 0.5% default
  const [swapStep, setSwapStep] = useState<SwapStep>('IDLE');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Switch input and output
  const switchTokens = useCallback(() => {
    setInputToken(outputToken);
    setOutputToken(inputToken);
  }, [inputToken, outputToken]);

  // Real-time Dynamic Quote Computation
  const quote: SwapQuote = useMemo(() => {
    const parsedAmount = parseFloat(inputAmount) || 0;
    const rate = inputToken.priceUSD / (outputToken.priceUSD || 1);
    const rawOutput = parsedAmount * rate;

    // Price impact simulation based on trade size
    const tradeValueUSD = parsedAmount * inputToken.priceUSD;
    const priceImpact = Math.min(4.5, +(tradeValueUSD / 500000 * 0.4).toFixed(3));
    const effectiveOutput = rawOutput * (1 - priceImpact / 100);
    const minimumReceived = (effectiveOutput * (1 - slippage / 100)).toFixed(4);

    return {
      inputToken,
      outputToken,
      inputAmount,
      outputAmount: effectiveOutput > 0 ? effectiveOutput.toFixed(4) : '0.00',
      executionPrice: +rate.toFixed(4),
      priceImpact,
      minimumReceived,
      slippageTolerance: slippage,
      estimatedGasUSD: +(3.85 + Math.random() * 0.4).toFixed(2),
      route: [
        { protocol: 'Uniswap v3', percentage: 70, poolFee: '0.05%' },
        { protocol: 'Curve Finance', percentage: 30, poolFee: '0.04%' },
      ],
    };
  }, [inputToken, outputToken, inputAmount, slippage]);

  // Execute Swap Lifecycle
  const executeSwap = useCallback(async () => {
    setErrorMessage(null);
    try {
      // Step 1: Token Approval (ERC-20 standard check)
      if (inputToken.symbol !== 'ETH') {
        setSwapStep('APPROVING');
        await new Promise((resolve) => setTimeout(resolve, 1400));
        setSwapStep('APPROVED');
        await new Promise((resolve) => setTimeout(resolve, 600));
      }

      // Step 2: Signature
      setSwapStep('SIGNING');
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Step 3: Broadcast & Confirmation
      setSwapStep('CONFIRMING');
      await new Promise((resolve) => setTimeout(resolve, 1800));

      const hash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      setTxHash(hash);
      setSwapStep('SUCCESS');
    } catch (err: any) {
      setSwapStep('ERROR');
      setErrorMessage(err.message || 'Transaction failed or rejected by user');
    }
  }, [inputToken.symbol]);

  const resetSwap = useCallback(() => {
    setSwapStep('IDLE');
    setTxHash(null);
    setErrorMessage(null);
  }, []);

  return {
    inputToken,
    setInputToken,
    outputToken,
    setOutputToken,
    inputAmount,
    setInputAmount,
    slippage,
    setSlippage,
    quote,
    switchTokens,
    swapStep,
    executeSwap,
    resetSwap,
    txHash,
    errorMessage,
  };
}

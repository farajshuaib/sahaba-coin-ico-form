import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { environment } from "../config";
import {
  calculateParityFromTo,
  fetchBuyersAmount,
  getBalance,
} from "../utils/functions";
import { Contract, utils } from "ethers";
import presaleAbi from "../contracts/presaleAbi.json";
import tokenAbi from "../contracts/tokenAbi.json";
import { parseEther } from "ethers/lib/utils";
import { useWeb3React } from "@web3-react/core";

const useStore = () => {
  const [tokens, setTokens] = useState<Token[]>(environment.tokens);
  const [tokenFrom, setTokenFrom] = useState<Token>(environment.tokens[0]);
  const [priceFrom, setPriceFrom] = useState<string>("");
  const [priceTo, setPriceTo] = useState<string>("");
  const [toTokenBalance, setToTokenBalance] = useState<number | string>(0);
  const [totalTokenForSale, setTotalTokenForSale] = useState<number | string>(
    0
  );
  const [totalTokenSold, setTotalTokenSold] = useState<number | string>(0);
  const [pricePerEther, setPricePerEther] = useState<number | string>(0);
  const { active, library, account, chainId, deactivate } = useWeb3React();
  const [loading, setLoading] = useState<boolean>(false);

  async function getAccount() {
    try {
      if (!account) return;
      setLoading(true);
      const netBalance = await getBalance(account); // utils.formatEther(netBalanceResourse);   // utils.parseUnits(netBalanceResourse).toString();

      const vendorContract = new Contract(
        environment.vendorAddress,
        presaleAbi as any,
        library.getSigner()
      );

      tokens.forEach(async (token) => {
        if (token.id === environment.networkMainToken) {
          token.balance = netBalance;
        }
      });

      const balance = await fetchBuyersAmount(
        account,
        library.getSigner(),
        toTokenBalance
      );
      setToTokenBalance(balance);

      const totalTokensSoldAmount = await vendorContract.totalTokenSold();
      setTotalTokenSold(+utils.formatEther(totalTokensSoldAmount).toString());

      const totalTokensForSaleAmount = await vendorContract.totalTokenForSale();
      setTotalTokenForSale(
        +utils.formatEther(totalTokensForSaleAmount).toString()
      );

      const tokenPrice = await vendorContract.getTokenPrice();
      setPricePerEther(utils.formatEther(tokenPrice).toString());

      setLoading(false);
    } catch (errors: any) {
      console.log("errors", errors);
      setLoading(false);
      throw errors;
    }
  }

  async function buyTokens() {
    try {
      if (!account) return;
      setLoading(true);
      const vendorContract = new Contract(
        environment.vendorAddress,
        presaleAbi as any,
        library.getSigner()
      );

      const tx = await vendorContract.buyTokens({
        value: utils.parseEther(parseFloat(priceFrom).toString()),
        gasLimit: 3 * 10 ** 6,
      });

      console.log(tx);

      await tx.wait();

      const balance = await fetchBuyersAmount(
        account,
        library.getSigner(),
        toTokenBalance
      );
      setToTokenBalance(balance);
      setLoading(false);
    } catch (errors: any) {
      console.log("errors", errors);
      setLoading(false);
      throw errors;
    }
  }

  useEffect(() => {
    getAccount();
  }, [account]);

  // watch price in other coin
  useEffect(() => {
    setPriceTo(
      calculateParityFromTo(pricePerEther as string, priceFrom as string).toString()
    );
  }, [priceFrom]);

  return {
    tokens,
    setTokens,
    toTokenBalance,
    setToTokenBalance,
    getAccount,
    tokenFrom,
    setTokenFrom,
    priceFrom,
    buyTokens,
    setPriceFrom,
    priceTo,
    setPriceTo,
    totalTokenForSale,
    active,
    library,
    account,
    chainId,
    deactivate,
    loading,
    pricePerEther
  };
};

export default useStore;

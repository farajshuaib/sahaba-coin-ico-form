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
  const { active, library, account, chainId, deactivate } = useWeb3React();
  const [loading, setLoading] = useState<boolean>(false);

  async function getAccount() {
    if (!account) return;
    try {
      setLoading(true);
      const netBalanceResourse = await getBalance(account);

      const netBalance = netBalanceResourse; // utils.formatEther(netBalanceResourse);   // utils.parseUnits(netBalanceResourse).toString();

      const presaleContract = new Contract(
        environment.vendorAddress,
        presaleAbi as any,
        library.getSigner()
      );

      tokens.forEach(async (token) => {
        if (token.id === environment.networkMainToken) {
          token.balance = netBalance;

          const rateOfNativeCurrencyResponse = await presaleContract.rate();
          token.price = utils
            .formatEther(rateOfNativeCurrencyResponse)
            .toString();

          // changeSelectFromToken(token.token);
        } else {
          const contract = new Contract(
            token.address as string,
            tokenAbi,
            library.getSigner()
          );

          // const tokenBalance = await contract.balanceOf(account);
          // console.log(tokenBalance)
          // token.balance = utils.formatUnits(tokenBalance, token.decimals);

          const rateOfToken = await presaleContract.tokenPrices(token.address);

          token.price = utils.formatUnits(rateOfToken, token.decimals);
        }
      });

      setTokens([...tokens]);

      const balance = await fetchBuyersAmount(
        account,
        library.getSigner(),
        toTokenBalance
      );
      setToTokenBalance(balance);
      setLoading(false);
    } catch (errors: any) {
      setLoading(false);
      console.log("errors", errors);
      throw errors;
    }
  }

  async function buyToken(
    value: string | number,
    token: Token,
    signer: any,
    address: string
  ) {
    if (!+value) return;
    try {
      const preSaleContract = new Contract(
        environment.vendorAddress,
        presaleAbi as any,
        signer
      );

      const amount = utils.parseUnits(value.toString(), token.decimals);

      if (token.id === environment.networkMainToken) {
        const tx = await preSaleContract.buyToken(
          environment.ZERO_ADDRESS,
          "0".repeat(environment.TOKEN_DECIMAL),
          {
            from: address,
            value: amount,
          }
        );
        await tx.wait();
      } else {
        const tokenContract = new Contract(
          token.address as string,
          tokenAbi as any,
          signer
        );

        const allowance = await tokenContract.allowance(
          address,
          environment.vendorAddress
        );

        if (!Number(allowance)) {
          await tokenContract.approve(
            environment.vendorAddress,
            utils.parseEther("9999999999999999999999999999"),
            { from: address }
          );
          toast.success("Spend approved");
        }

        const tx = await preSaleContract.buyToken(token.address, amount, {
          from: address,
        });
        await tx.wait();
      }

      // if (environment.apiUrl) {
      //   axios.post(`${environment.apiUrl}/purchase-successful`, payload);
      // }

      toast.success(
        `You have successfully purchased $${environment.lockedToken.id} Tokens. Thank you!`
      );

      // const totalTokensSold = await fetchTotalTokensSold(signer);

      tokens.forEach(async (token) => {
        if (token.id === environment.networkMainToken) {
          // const netBalanceResponse = await getBalance(address);
          // const netBalance = utils.formatEther(netBalanceResponse);

          token.balance = await getBalance(address);
        } else {
          const contract = new Contract(
            token.address as string,
            tokenAbi,
            signer
          );
          const tokenBalance = await contract.balanceOf(address);

          const balance = utils.formatUnits(tokenBalance, token.decimals);
          token.balance = balance;
        }
      });

      setTokens([...tokens]);
      const balance = await fetchBuyersAmount(address, signer, toTokenBalance);
      setToTokenBalance(balance);
    } catch (error: any) {
      console.log("err", error.message);
      toast.error(error?.message || "Signing failed, please try again!");
    }
  }

  async function checkLimitations(priceTo: string | number = 0) {
    const rate = tokens.find(
      (t) => t.id === environment.networkMainToken
    )?.price;

    if (!rate) {
      toast.error("something went wrong");
      return false;
    }

    const totalBalance = (+toTokenBalance + +priceTo) * +rate;

    if (totalBalance < environment.minTokenAmount) {
      toast.error(
        `You can not buy less than ${environment.minTokenAmount} ${environment.networkMainToken}`
      );
      return false;
    } else if (totalBalance > environment.maxTokenAmount) {
      toast.error(
        `You can not buy more than ${environment.maxTokenAmount} ${environment.networkMainToken}`
      );
      return false;
    }

    return true;
  }

  useEffect(() => {
    getAccount();
  }, [account]);

  // watch price in other coin
  useEffect(() => {
    setPriceTo(
      calculateParityFromTo(
        tokenFrom.price as string,
        priceFrom as string
      ).toString()
    );
  }, [priceFrom]);

  return {
    checkLimitations,
    tokens,
    setTokens,
    toTokenBalance,
    setToTokenBalance,
    getAccount,
    tokenFrom,
    setTokenFrom,
    priceFrom,
    buyToken,
    setPriceFrom,
    priceTo,
    setPriceTo,
    active,
    library,
    account,
    chainId,
    deactivate,
    loading,
    setLoading,
  };
};

export default useStore;

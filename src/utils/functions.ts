import { toast } from "react-toastify";
import { environment } from "../config";
import { ethers, Contract, utils, BigNumber } from "ethers";
import presaleAbi from "../contracts/presaleAbi.json";
import tokenAbi from "../contracts/tokenAbi.json";

export const getBalance = async (address: string) => {
  if (!window?.ethereum) {
    toast.warning("you don't have metamask extension on your browser");
  }
  const provider = new ethers.providers.Web3Provider(window?.ethereum);
  const balance = await provider.getBalance(address);
  const balanceInEth = ethers.utils.formatEther(balance);
  return balanceInEth;
};

export const calculateParityFromTo = (parityRate: string, value: string) => {
  if (!+parityRate || !+value) return 0;
  return Number.parseFloat(value) / Number.parseFloat(parityRate);
};

export const fetchTotalTokensSold = async (signer: any) => {
  try {
    const preSaleContract = new Contract(
      environment.vendorAddress,
      presaleAbi as any,
      signer
    );

    const totalTokensSoldAmount = await preSaleContract.totalTokensSold();

    let totalTokensSold = utils.formatUnits(
      totalTokensSoldAmount,
      environment.lockedToken.decimals
    );
    return totalTokensSold;
  } catch (error) {
    toast.error("Something goes wrong, please try again!");
  }
};

export const fetchBuyersAmount = async (
  address: any,
  signer: any,
  lockedBalance: number | string
) => {
  const tokenContract = new Contract(
    environment.lockedToken.address,
    tokenAbi,
    signer
  );
  const balance = await tokenContract.balanceOf(address);
  lockedBalance = utils.formatUnits(
    BigNumber.from(balance),
    environment.lockedToken.decimals
  );
  return lockedBalance;
};

export const addTokenAsset = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: environment.lockedToken.address,
          symbol: environment.lockedToken.id,
          decimals: 18,
        },
      },
    });
    toast.success("Token imported to metamask successfully");
  } catch (e) {
    toast.error("Token import failed");
  }
};

export const switchNetwork = async () => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + environment.networkId.toString(16) }],
    });
  } catch (err: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (err.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainName: environment.networkName,
            chainId: "0x" + environment.networkId.toString(16),
            nativeCurrency: {
              name: environment.networkMainToken,
              decimals: 18,
              symbol: environment.networkMainToken,
            },
            rpcUrls: [environment.rpcUrl],
          },
        ],
      });
    } else {
      toast.error("Please switch to " + environment.networkName);
      return false;
    }
  }
  return true;
};

import React from "react";
import { useWeb3React } from "@web3-react/core";
import { Modal } from "flowbite-react";
import { toast } from "react-toastify";

import img1 from "../assets/connect-1.png";
import img4 from "../assets/connect-4.png";
import { connectors } from "../services/connectors";
import { environment } from "../config";
import { switchNetwork } from "../utils/functions";

interface Props {
  visible: boolean;
  close: () => void;
}

const ConnectToWallet: React.FC<Props> = ({ visible, close }) => {
  const web3React = useWeb3React();

  const handleSignIn = async (wallet_item: any) => {
    try {
      web3React.activate(wallet_item.connector);
      if (environment.networkId !== web3React.chainId) {
        const result = await switchNetwork();
        if (!result) return;
      }
      window.localStorage.setItem("provider", wallet_item.provider);
      if (!web3React.error) {
        toast.success("Connecting to wallet has been done successfully!");
        close();
        return;
      }
      toast.error(
        web3React.error?.message ||
          "Connecting to wallet has been failed!, you're connecting to unsupported network! please switch to BSC"
      );
    } catch (e: any) {
      toast.error(e || "Connecting to wallet has been failed!");
    }
  };

  const links = [
    {
      img: img1,
      title: "Meta Mask",
      connector: connectors.injected,
      provider: "injected",
      description: "using browser extension",
    },
    {
      img: img4,
      title: "Wallet Connect",
      connector: connectors.walletConnect,
      provider: "walletConnect",
      description: "using browser extension",
    },
    // {
    //   img: img5,
    //   title: "Coinbase Wallet",
    //   connector: connectors.coinbaseWallet,
    //   provider: "coinbaseWallet",
    //   description: "using browser extension",
    // },
  ];

  return (
    <Modal show={visible} onClose={close}>
      <Modal.Header>Connect to wallet</Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          {links.map((item, index) => (
            <button
              key={index}
              onClick={() => handleSignIn(item)}
              className="flex flex-wrap items-center gap-4 px-4 py-2 border border-gray-100 rounded-lg focus-within:ring-1 ring-primary hover:bg-gray-50"
            >
              <img
                src={item.img}
                alt={item.title}
                className="object-cover mx-auto "
              />
              <div className="flex flex-col w-full gap-4 text-center md:w-auto">
                <h4 className="text-xl font-medium text-gray-800 md:text-xl">
                  {item.title}
                </h4>
                <p className="text-gray-500">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConnectToWallet;

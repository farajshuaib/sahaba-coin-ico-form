import { useWeb3React } from "@web3-react/core";
import React from "react";
import { environment } from "../config";
import { addTokenAsset } from "../utils/functions";

const Nav: React.FC = () => {
  const { active } = useWeb3React();
  return (
    <nav className="">
      <div className="container mx-auto flex justify-between">
        <div className="logo flex items-center gap-x-2">
          <img src="/logo_dark.png" className="w-24 object-cover" />
          <h1 className="text-4xl text-gray-700 uppercase leading-relaxed text-light">
            Sahaba Coin
          </h1>
        </div>
        <div className="flex items-center gap-x-3">
          {active && (
            <button
              type="button"
              onClick={addTokenAsset}
              className="flex items-center gap-2 text-sm font-medium bg-blue-500/20 p-3 rounded-lg text-primary text-center uppercase leading-relaxed tracking-wide hover:bg-primary hover:text-white transition-all"
            >
              <img
                src="/images/metamask.svg"
                alt="metamask"
                className="h-6 text-white"
              />
              Add {environment.lockedToken.id} token to wallet
            </button>
          )}
          <button className="bg-primary flex items-center gap-2 text-sm font-medium  p-3 rounded-lg text-white text-center uppercase leading-relaxed tracking-wide transition-all">
            <img
              src="/images/telegram.svg"
              alt="telegram"
              className="h-6 text-white"
            />
            Support
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { ToastContainer } from "react-toastify";

import "flowbite/dist/flowbite";
import "react-toastify/dist/ReactToastify.css";

import "./styles/index.css";
import "./styles/animations.css";

const getLibrary = (provider: any) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 8000; // frequency provider is polling
  return library;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <App />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Web3ReactProvider>
  </React.StrictMode>
);

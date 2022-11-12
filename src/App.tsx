import { useWeb3React } from "@web3-react/core";
import { useMemo, useState } from "react";
import useStore from "./hooks/useStore";
import figure1 from "./assets/figure-1.png";
import figure2 from "./assets/fs-bg-2.png";
import { environment } from "./config";
import AccountAddressBadge from "./components/AccountAddressBadge";
import { Badge, Spinner } from "flowbite-react";
import ConnectToWallet from "./components/ConnectToWallet";
import TokenSelectorModal from "./components/TokenSelectorModal";
import Nav from "./components/Nav";

const App: React.FC = () => {
  const {
    toTokenBalance,
    tokenFrom,
    setTokenFrom,
    priceFrom,
    setPriceFrom,
    priceTo,
    setPriceTo,
    buyToken,
    checkLimitations,
    loading,
    setLoading,
    active,
    library,
    account,
    deactivate,
  } = useStore();

  const [connectToWalletModalVisible, setConnectToWalletModalVisible] =
    useState(false);
  const [tokenSelectorModalVisible, setTokenSelectorModalVisible] =
    useState<boolean>(false);

  const setBalance = (val: number) => {
    if (!tokenFrom?.balance) return;
    setPriceFrom((+tokenFrom.balance * val).toString());
  };

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    // check if not connected to wallet, if not well set modal to login...
    if (!active || !account) {
      setConnectToWalletModalVisible(true);
      return;
    }

    if (!checkLimitations(priceTo)) return;
    setLoading(true);

    await buyToken(
      priceFrom,
      tokenFrom as Token,
      library?.getSigner(),
      account
    );

    setPriceFrom("0");

    setLoading(false);
  };

  const insufficientBalance = useMemo(() => {
    return (tokenFrom?.balance ?? 0) < +priceFrom;
  }, [tokenFrom, priceFrom]);

  return (
    <div className="App relative ">
      <div className="text-center bg-yellow-200 text-yellow-700 p-5 text-lg leading-relaxed tracking-wide">
        This is a demo app for the sahaba coin, a coin is still under development
      </div>
      <Nav />
      <img
        src={figure1}
        alt=""
        className="absolute animated-img left-0 -z-10"
      />
      <img
        src={figure2}
        alt=""
        className="absolute animated-img right-0 -z-10"
      />
      {/* <img
          src={fsRoundBlue}
          alt=""
          className="absolute right-24 animated-img top-0 hidden md:block"
        /> */}
      <main id="swapForm" className="relative my-5">
        <form
          onSubmit={submit}
          className="flex flex-col gap-8 w-full md:w-3/4 xl:w-1/2 p-5 md:p-12 mx-auto rounded-lg swap-form-bg"
        >
          <h1 className="text-gray-800 text-3xl md:text-4xl text-center font-medium">
            Buy {environment.lockedToken.id} token
          </h1>

          {active && <AccountAddressBadge />}
          {/* from */}
          <div>
            <div className="relative flex items-center select-none overflow-hidden rounded-lg">
              <button
                onClick={() => setTokenSelectorModalVisible(true)}
                type="button"
                className="justify-center absolute items-center left-0 flex  bg-blue-50 h-full rounded-l-lg px-3 border border-gray-200 border-r-0  flex-col  gap-x-2"
              >
                <img
                  src={tokenFrom?.image}
                  alt={`${tokenFrom?.id} logo`}
                  width="40"
                  height="40"
                  className="bg-white rounded-full w-7 h-7 p-1"
                  loading="lazy"
                />
                {tokenFrom?.id}
              </button>
              <input
                placeholder="0.0"
                className={` py-4 px-5 pl-20 border focus-within:ring-4 focus:ring-4 border-gray-200 rounded-lg bg-white font-medium text-3xl w-full`}
                min="0"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.currentTarget.value)}
                max="79"
                pattern="^[0-9]*[.,]?[0-9]*$"
                autoComplete="off"
                autoCorrect="off"
                type="number"
                disabled={!active}
              />
              <div className="justify-center absolute items-center right-0 flex gap-5 bg-gray-50 h-full rounded-r-lg px-3 border border-gray-200 border-l-0 ">
                {/* <button type="button" onClick={() => setBalance(0.5)}>
                  <Badge color="info">50%</Badge>
                </button> */}
                <button type="button" onClick={() => setBalance(1)}>
                  <Badge color="info">Max</Badge>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-end mt-2">
              {tokenFrom && (
                <Badge color="info">Balance: {tokenFrom.balance ?? 0}</Badge>
              )}
            </div>
          </div>

          {/* To... */}
          <div>
            <div className="relative flex items-center select-none">
              <div className="justify-center absolute items-center left-0 flex  bg-blue-50 h-full rounded-l-lg px-3 border border-gray-200 border-r-0 flex-col  gap-x-2">
                <img
                  src={environment.lockedToken.image}
                  alt={`${environment.lockedToken.id} logo`}
                  width="40"
                  height="40"
                  className="bg-white rounded-full w-7 h-7 p-1"
                  loading="lazy"
                />
                {environment.lockedToken.id}
              </div>
              <input
                placeholder="0.0"
                className="py-4 px-5 border pl-20 border-gray-200 rounded-lg bg-white font-medium text-3xl w-full"
                min="0"
                max="79"
                value={priceTo}
                pattern="^[0-9]*[.,]?[0-9]*$"
                autoComplete="off"
                autoCorrect="off"
                disabled={true}
              />
            </div>
            <div className="flex justify-between flex-wrap gap-4 mt-2">
              {tokenFrom?.price ? (
                <Badge color="success">
                  price: 1 {environment.lockedToken.id} = {tokenFrom.price}{" "}
                  {tokenFrom.id}
                </Badge>
              ) : (
                <span></span>
              )}
              <Badge color="info">Balance: {toTokenBalance ?? 0}</Badge>
            </div>
          </div>

          <button
            type="submit"
            onClick={submit}
            disabled={(active && insufficientBalance) || loading}
            className={`block w-full ${
              insufficientBalance ? "bg-gray-400" : "bg-primary"
            } rounded-lg py-3 font-bold leading-relaxed tracking-wider text-white`}
          >
            {loading ? (
              <Spinner color="info" aria-label="submitting" />
            ) : active ? (
              insufficientBalance ? (
                "insufficient balance"
              ) : (
                "Submit"
              )
            ) : (
              "Connect to wallet"
            )}
          </button>

          {active && (
            <button
              type="button"
              onClick={deactivate}
              className="text-red-600 text-lg font-medium"
            >
              Disconnect wallet
            </button>
          )}
        </form>

        <ConnectToWallet
          visible={connectToWalletModalVisible}
          close={() => setConnectToWalletModalVisible(false)}
        />

        {tokenSelectorModalVisible && (
          <TokenSelectorModal
            tokenFrom={tokenFrom as Token}
            tokenTo={environment.lockedToken}
            closeModal={() => setTokenSelectorModalVisible(false)}
            selectedToken={(token: Token) => {
              setTokenFrom(token);
              setPriceFrom("0");
              setPriceTo("0");
            }}
          />
        )}
      </main>
    </div>
  );
};

export default App;

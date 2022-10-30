export const APP_NAME: string = "Sahaba";

export const headerTitle: string = "Sahaba Coin Just Entered";
export const headerSubTitle: string = "the Real World";
export const headerDescription: string =
  "This application can help you to raise funds for your project and/or business. You can start the presale of your own token and start selling it immediately. Contact us on Telegram to know more.";

export const LOGO_URL = "/logo_dark.svg"; // add the logo to public folder...

export const WHITEPAPER_URL: string = "#";

export const tokenInfo = [
  { title: "name", value: "Ethereum ERC20  " },
  { title: "Purchase methods accepted:  ", value: "ETH" },
  { title: "New Token emissions:", value: "Unavailable" },
  { title: "Bonus system:  ", value: "Yes" },
  { title: "Presale of Private Sale:  ", value: "Not held  " },
  { title: "Know Your Customer (KYC):  ", value: "Yes" },
  { title: "Min/Max Personal Cap:  ", value: "0.01 ETH / No limit  " },
  { title: "Whitelist:  ", value: "No  " },
];

export const EMAIL = "example@example.com";
export const PHONE_NUMBER = "00218911629062";
export const TELEGRAM_LINK = "https://t.me/sahabacoin";

export const environment = {
  vendorAddress: "0xCA6117399F9c8186340E057BdE096c632139B55a",
  networkName: "Goerli Test Network",
  networkMainToken: "ETH",
  networkId: 5,
  rpcUrl: "https://goerli.infura.io/v3",
  ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
  TOKEN_DECIMAL: 18,

  // this min-max range is used to calculate the amount of tokens to buy in mainnetToken per user
  minTokenAmount: 0.01,
  maxTokenAmount: 10,

  lockedToken: {
    id: "SBH",
    name: "Sahaba",
    image: "/images/tokens/sahaba.svg",
    address: "0x856A3F8f7E8Af762Fb412133456214740108d58a",
    decimals: 18,
  },

  tokens: [
    {
      id: "ETH",
      name: "Ethereum",
      address: undefined,
      image: "/images/tokens/eth.svg",
      decimals: 18,
    },
    {
      id: "USDT",
      name: "Tether",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      image: "/images/tokens/usdt.svg",
      decimals: 18,
    },
  ],
};

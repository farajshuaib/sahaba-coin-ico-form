import { useWeb3React } from "@web3-react/core";
import { Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AccountAddressBadge: React.FC = () => {
  const [copied, setCopied] = useState<string>("");

  const { account } = useWeb3React();

  useEffect(() => {
    document.addEventListener("copy", (event) => {
      let selection: any = document.getSelection();
      if (!selection) return;
      event.clipboardData?.setData("text/plain", selection.toString());
      setCopied(selection.anchorNode?.data);
      event.preventDefault(); // We want our data, not data from any selection, to be written to the clipboard
    });
  }, []);

  return (
    <div
      className="truncate p-3 w-full flex justify-center items-center text-center h-fit font-semibold bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800 group-hover:bg-blue-200 dark:group-hover:bg-blue-300 rounded text-xs"
      onClick={() => {
        if (!account) return;
        navigator.clipboard.writeText(account).then(() => {
          setCopied(account);
          toast.success("your address copied to the clipboard !");
        });
      }}
    >
      <Tooltip
        content={copied == account ? "copied" : "click to copy"}
        trigger="hover"
      >
        <h6 className="truncate align-middle flex justify-center items-center cursor-pointer select-none w-full text-center self-center">
          <span className="font-bolder text-base mr-1">my account:</span>
          <span className="truncate w-32 md:w-full">{account}</span>
        </h6>
      </Tooltip>
    </div>
  );
};


export default AccountAddressBadge;
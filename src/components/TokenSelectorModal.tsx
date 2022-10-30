import React, { useRef } from "react";
import useStore from "../hooks/useStore";

interface Props {
  tokenFrom: Token;
  tokenTo: Token;
  closeModal: () => void;
  selectedToken: (token: Token) => void;
}

const TokenSelectorModal: React.FC<Props> = ({
  tokenFrom,
  tokenTo,
  closeModal,
  selectedToken,
}) => {
  const listRef = useRef<HTMLUListElement>(null);
  const { tokens } = useStore();

  const closeModalByRef = (event: any) => {
    if (!listRef.current) return;
    if (
      event.target instanceof HTMLElement &&
      !listRef?.current.contains(event.target)
    ) {
      closeModal();
    }
  };

  return (
    <div
      onClick={closeModalByRef}
      aria-label="modal"
      className="fixed z-4 inset-0 bg-slate-500 bg-opacity-50 pt-16 px-4"
    >
      <ul
        ref={listRef}
        className="max-h-[80vh] overflow-y-auto w-96 max-w-full bg-white dark:bg-slate-500 rounded-2xl shadow-lg mx-auto py-4"
      >
        <li className="pb-4 w-full">
          <button
            aria-label="close"
            type="button"
            className="block ml-auto  px-4 group"
            onClick={closeModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="modal-close-icon group-hover:bg-slate-700 group-hover:text-slate-200 dark:group-hover:bg-slate-200 dark:group-hover:text-slate-900"
              viewBox="0 0 512 512"
            >
              <title>Close modal</title>
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M368 368L144 144M368 144L144 368"
              />
            </svg>
          </button>
        </li>

        {tokens.map((item: Token) => (
          <li key={item.id}>
            <button
              className="modal-token-item w-full"
              type="button"
              disabled={tokenFrom?.id === item.id || tokenTo?.id === item.id}
              onClick={() => {
                selectedToken(item);
                closeModal();
              }}
            >
              <img
                src={item.image}
                alt={`${item.id} logo`}
                width="40"
                height="40"
                className="bg-white rounded-full w-10 h-10 p-1"
                loading="lazy"
              />
              <p className="flex flex-col font-medium text-justify">
                <span>{item.id}</span>
                <span className="modal-token-name">{item.name}</span>
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TokenSelectorModal;

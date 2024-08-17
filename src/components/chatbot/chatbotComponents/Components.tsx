import React from "react";

import tw from "tailwind-styled-components";
import { ChatbotSvg,  } from "./ChatbotSvg";
import {
  ExtraSmallText,
 
  MediumText,
  SmallText,
} from "../../Typography";
import { LANG } from "../../../constants";
import { useChatbot } from "../../../providers/chatbotProvider";
import { Icon } from "../../Icons";
import { CircularLoader } from "../../loaders";

export const ChatsLoader = () => {
  return <div className="h-full gap-2 text-purple-800 w-full flex flex-col items-center justify-center">
    <CircularLoader className="text-inherit h-5 w-5" />
    <SmallText>Getting Your Chats.</SmallText>
  </div>;
};

export const ChatBotIcon = () => {
  const { chatbot, toggleChat } = useChatbot();

  return (
    <div
      className={`fixed  h-10 w-10  sm:flex  text-white flex items-center justify-center  rounded-full drop-shadow-lg hover:scale-110 transition-all duration-200 bg-purple-500 z-50 bottom-6 right-6 transform ${
        chatbot.open ? "rotate-180 hidden" : ""
      } `}
      onClick={toggleChat}
    >
      {chatbot.open ? (
        <Icon icon="chevron-up" className="p-0.5" />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="p-3"
          viewBox="0 0 28 32"
        >
          <path
            className="fill-white"
            d="M28 32s-4.714-1.855-8.527-3.34H3.437C1.54 28.66 0 27.026 0 25.013V3.644C0 1.633 1.54 0 3.437 0h21.125c1.898 0 3.437 1.632 3.437 3.645v18.404H28V32zm-4.139-11.982a.88.88 0 00-1.292-.105c-.03.026-3.015 2.681-8.57 2.681-5.486 0-8.517-2.636-8.571-2.684a.88.88.105 00-1.29.107 1.01 1.01 0 00-.219.708.992.992 0 00.318.664c.142.128 3.537 3.15 9.762 3.15 6.226 0 9.621-3.022 9.763-3.15a.992.992 0 00.317-.664 1.01 1.01 0 00-.218-.707z"
          ></path>
        </svg>
      )}
    </div>
  );
};

export const ChatHeader = () => {
  const { onBackToChats, toggleChat } = useChatbot();

  return (
    <header className="p-2 py-4 border-b w-full flex">
      <ActionIcon
        icon="chevron-left"
        className="text-purple-700"
        onClick={onBackToChats}
      />

      <div
        className={`flex flex-col px-2 items-center flex-1 justify-center transition-all duration-200 gap-2  `}
      >
        <ChatbotSvg className="h-8 w-8" />
        <MediumText>{LANG.CHATBOT.ASK_A_QUESTION}</MediumText>

        <ExtraSmallText className="text-center">
          {LANG.CHATBOT.DEFAULT_QUESTION}
        </ExtraSmallText>
      </div>
      <ActionIcon
        icon="x"
        className="text-purple-800 sm:invisible visible"
        onClick={toggleChat}
      />
    </header>
  );
};

const ActionIcon = tw(
  Icon
)` text-blue-600 hover:bg-purple-100 p-1 !h-10 cursor-pointer !w-10 rounded-2xl transition-all duration-300`;

import React, { useState } from "react";

import tw from "tailwind-styled-components";
import { MessageSvg } from "./ChatbotSvg";
import { H5, LargeText, MediumText, SmallText } from "../../Typography";
import { LANG } from "../../../constants";
import { useChatbot } from "../../../providers/chatbotProvider";
import { Icon } from "../../Icons";

export const NoMessagesPlaceholder = () => {
  return (
    <div className=" justify-center m-auto items-center flex flex-col gap-2">
      <MessageSvg />
      <LargeText>{LANG.CHATBOT.NO_MESSAGES}</LargeText>
      <SmallText>{LANG.CHATBOT.MESSAGES_FROM_TEAM}</SmallText>
    </div>
  );
};

export const ChatBotIcon = () => {
  const { chatbot, toggleChat } = useChatbot();

  return (
    <div
      className={`fixed  h-10 w-10   text-white flex items-center justify-center  rounded-full drop-shadow-lg hover:scale-110 transition-all duration-200 bg-blue-500 z-50 bottom-6 right-6 transform ${
        chatbot.open ? "rotate-180 " : ""
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

type ChatHeaderPropsT = {
  isDetailedView?: boolean;
  allowToggle?: boolean;
};

export const CoversationHeader = () => {
  return (
    <div className="flex w-full items-center transition-all duration-200 hover:bg-gray-100 gap-3 rounded-lg cursor-pointer  ">
      <img
        src="https://static.intercomassets.com/assets/default-avatars/fin/128-6a5eabbb84cc2b038b2afc6698ca0a974faf7adc9ea9f0fb3c3e78ac12543bc5.png"
        alt="Artisan profile"
        width={40}
        height={40}
      />
      <div className="flex flex-col justify-start items-start">
        <MediumText>{LANG.CHATBOT.CHATBOT_NAME}</MediumText>
        <MediumText className="inline-flex items-center gap-1">
          <span className="bg-gray-500 px-1.5 py-0 text-[0.7rem] text-white rounded-md">
            AI
          </span>
          {"Bot"}
        </MediumText>
      </div>
    </div>
  );
};
export const ChatHeader = (props: ChatHeaderPropsT) => {
  const { onBackToChats, toggleChat } = useChatbot();
  const { allowToggle, isDetailedView } = props;
  const [showDetailedView, setShowDetailedView] = useState(isDetailedView);
  const toggleView = () => {
    setShowDetailedView((prev) => !prev);
  };
  return (
    <div className="py-2 border-b">
      <Header>
        <ActionIcon icon="chevron-left" onClick={onBackToChats} />
        {showDetailedView ? (
          <H5 className="inline-flex flex-1 justify-center items-center">
            {LANG.CHATBOT.CHATBOT_NAME}
          </H5>
        ) : null}
        {!showDetailedView ? (
          <button
            disabled={!allowToggle}
            onClick={toggleView}
            className={`flex flex-col flex-1 items-center w-full gap-3 p-3 ${
              allowToggle ? "hover:bg-gray-100 rounded-lg" : ""
            }`}
          >
            <CoversationHeader />
          </button>
        ) : null}

        <ActionIcon
          icon="x"
          className="sm:invisible visible"
          onClick={toggleChat}
        />
      </Header>
      {showDetailedView ? (
        <div
          className={`flex flex-col px-2  transition-all duration-200 gap-3  `}
        >
          <button
            disabled={!allowToggle}
            onClick={toggleView}
            className={`flex flex-col flex-1 items-center w-full gap-3 p-3 ${
              allowToggle ? "hover:bg-gray-100 rounded-lg" : ""
            }`}
          >
            <img
              src="https://static.intercomassets.com/assets/default-avatars/fin/128-6a5eabbb84cc2b038b2afc6698ca0a974faf7adc9ea9f0fb3c3e78ac12543bc5.png"
              alt="Fin profile"
              width={50}
              height={50}
            />
            <MediumText>{LANG.CHATBOT.ASK_A_QUESTION}</MediumText>
            <div className="inline-flex gap-2 items-center">
              <Icon icon="alert-circle" />
              <SmallText>{LANG.CHATBOT.TEAM_CAN_HELP}</SmallText>
            </div>
          </button>
        </div>
      ) : null}
    </div>
  );
};

const Header = tw.header`flex   px-1.5`;
const ActionIcon = tw(
  Icon
)` text-blue-600 hover:bg-blue-100 p-3 !h-14 cursor-pointer !w-14 rounded-2xl transition-all duration-300`;

import React, { useEffect } from "react";
import { H2, H4, H5, MediumText, SmallText } from "../Typography";
import { useChatbot } from "../../providers/chatbotProvider";
import { BackendGet } from "../../integration";
import { backendRoutes, LANG } from "../../constants";
import { CircularLoader } from "../loaders";
import {
  ChatBotIcon,
  ChatbotSvg,
  ChatHeader,
  CoversationHeader,
} from "./chatbotComponents";
import { CreateChatButton } from "./chatbotComponents";
import ListItem from "./ChatListItem";

function ChatListView() {
  const {
    chatbot: { chatsListView, open },
    handleChatsListView,
    getChats,
  } = useChatbot();

  useEffect(() => {
    if (!chatsListView?.chats?.length) {
      getChats();
    }
  }, [open]);

  return (
    <div className="h-full flex relative flex-col w-full text-center overflow-auto">
      <header className="bg-purple-100 text-purple-800 p-3 rounded-t-lg border-b-purple-200 border-b z-10">
        <H5>Chats</H5>
      </header>
      <section className="flex-1 overflow-y-auto overflow-x-hidden">
        {chatsListView?.loading ? (
          <div className="h-full gap-2 text-purple-800 w-full flex flex-col items-center justify-center">
            <CircularLoader className="text-inherit" />
            <SmallText>Getting Your Chats.</SmallText>
          </div>
        ) : chatsListView?.chats?.length ? (
          <div className="h-full w-full">
            {chatsListView?.chats?.map((each) => {
              return <ListItem chat={each} key={each?.chat_id} onRouteToChatview={() => {}} />;
            })}
            <div className="absolute flex items-center justify-center w-full bottom-6">
                <CreateChatButton/>
            </div>
          </div>
        ) : (
          <div className="h-full w-full flex flex-col gap-2 items-center justify-center">
            <ChatbotSvg className="!h-16 !w-16" />
            <SmallText>{LANG.CHATBOT.DEFAULT_QUESTION}</SmallText>
            <CreateChatButton />
          </div>
        )}
      </section>
    </div>
  );
}

export default ChatListView;

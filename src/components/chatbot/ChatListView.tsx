import React, { useCallback, useEffect } from "react";
import { H5, SmallText } from "../Typography";
import { useChatbot } from "../../providers/chatbotProvider";

import { LANG } from "../../constants";

import { ChatbotSvg, ChatsLoader } from "./chatbotComponents";
import { CreateChatButton } from "./chatbotComponents";
import ListItem from "./ChatListItem";
import { ChatI } from "../../types/chatbot.types";

function ChatListView() {
  const {
    chatbot: { chatsListView, open },
    handleChatView,
    handleState,
    getChats,
  } = useChatbot();

  useEffect(() => {
    if (!chatsListView?.chats?.length) {
      getChats();
    }
  }, [open]);
  const onRouteToChatview = useCallback((chat: ChatI) => {
    handleState({ route: "chat-view" });
    handleChatView({ chatId: chat?.chat_id });
  }, []);
  return (
    <div className="h-full flex relative flex-col w-full text-center overflow-auto">
      <header className="bg-purple-100 text-purple-800 p-3 rounded-t-lg border-b-purple-200 border-b z-10">
        <H5>Chats</H5>
      </header>
      <section className="flex-1 overflow-y-auto overflow-x-hidden">
        {chatsListView?.loading ? (
          <ChatsLoader/>
        ) : chatsListView?.chats?.length ? (
          <div className="h-full w-full">
            {chatsListView?.chats?.map((each) => {
              return (
                <ListItem
                  chat={each}
                  key={each?.chat_id}
                  onRouteToChatview={onRouteToChatview}
                />
              );
            })}
            <div className="absolute flex items-center justify-center w-full bottom-6">
              <CreateChatButton label="New Chat" />
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

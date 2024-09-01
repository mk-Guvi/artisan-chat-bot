import  { useEffect } from "react";
import { H5, SmallText } from "../Typography";
import { useChatbot } from "../../providers/chatbotProvider";

import { LANG } from "../../constants";

import { ChatbotSvg, ChatsLoader } from "./chatbotComponents";
import { CreateChatButton } from "./chatbotComponents";
import ListItem from "./ChatListItem";
import { Icon } from "../Icons";

function ChatListView() {
  const {
    chatsListView,
    chatBotDetails,
    onRouteToChatview,
    toggleChat,
    getChatsList,
  } = useChatbot();

  useEffect(() => {
    if (!chatsListView?.chats?.length) {
      getChatsList();
    }
  }, [open]);

  return (
    <div className="h-full flex relative flex-col w-full text-center overflow-auto">
      <header className="bg-purple-100 text-purple-800 p-3 flex items-center rounded-t-lg border-b-purple-200 border-b z-10">
        <H5 className="flex-1">Chats</H5>
        <Icon icon="x" onClick={toggleChat} className="text-purple-600 !h-6 !w-6"/>
      </header>
      <section className="flex-1 hide-scroll divide-y flex flex-col overflow-x-hidden">
        {chatsListView?.loading ? (
          <ChatsLoader />
        ) : chatsListView?.chats?.length ? (
          <>
            <div className="flex-1 hide-scroll divide-y  overflow-y-auto overflow-x-hidden w-full">
              {chatsListView?.chats?.map((each) => {
                return (
                  <ListItem
                  chatBotDetails={chatBotDetails}
                    chat={each}
                    key={each?.chat_id}
                    onRouteToChatview={onRouteToChatview}
                  />
                );
              })}
            </div>
            <div className=" flex items-center h-14 justify-center w-full">
              <CreateChatButton label="New Chat" />
            </div>
          </>
        ) : (
          <div className="h-full w-full flex flex-col p-4 gap-2 items-center justify-center">
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

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useChatbot } from "../../providers/chatbotProvider";
import { H5 } from "../Typography";
import {
  ChatbotInputfield,
  ChatHeader,
  ChatsLoader,
  dummyData,
  MessageRenderer,
} from "./chatbotComponents";
import { makeId, suspenseDelay } from "../../../utils";
import { ChatActionI, ChatI } from "../../types/chatbot.types";

const ChatView = () => {
  const {
    onBackToChats,
    chatView,
    handleChatViewData,
    addMessage,
    updateMessage,
    handleActionsDisable,
    deleteMessage,
    actionsDisable,
    chatBotDetails,
  } = useChatbot();

  const currentChat = useMemo(
    () => chatView?.chats?.[chatView?.currentChat],
    [chatView?.chats, chatView?.currentChat]
  );
  const [inputValue, setInputValue] = useState({ messageId: "", value: "" });
  const isValidChat = useMemo(() => Boolean(currentChat), [currentChat]);
  const isLoading = currentChat?.loading;
  const chats = useMemo(() => currentChat?.chats || [], [currentChat?.chats]);
  const lastChat = useMemo(() => chats[chats.length - 1], [chats]);
  const showInputField = useMemo(
    () => !lastChat?.actions?.length,
    [lastChat?.actions]
  );

  const getChats = useCallback(async () => {
    try {
      handleChatViewData(chatView?.currentChat, { loading: true });
      await suspenseDelay(2000);
      handleChatViewData(chatView?.currentChat, {
        loading: false,
        chats: [
          {
            ...dummyData,
            actions: [
              {
                type: "BUTTON",
                value: "Action 1",
                action_id: "cascsc",
              },
              {
                type: "BUTTON",
                value: "Action 2",
                action_id: "scsa",
              },
              {
                type: "BUTTON",
                value: "Action 3",
                action_id: "assvca",
              },
            ],
          },
        ],
        count: 100,
        page: 1,
      });
    } catch (e) {
      console.error(e);
      handleChatViewData(chatView?.currentChat, { chats: [], loading: false });
    }
  }, [chatView?.currentChat, handleChatViewData]);

  useEffect(() => {
    if (isValidChat && !chats.length) {
      getChats();
    }
  }, [isValidChat, chats.length, getChats]);
  const onSelectAction = useCallback(
    async (chat: ChatI, action: ChatActionI) => {
      handleActionsDisable(true);
      const findChatIndex = currentChat?.chats?.findIndex(
        (e) => e.message?.id === chat?.message?.id
      );

      if (currentChat?.chats?.[findChatIndex + 1]?.message?.id) {
        deleteMessage(
          currentChat?.chats?.[findChatIndex + 1]?.chat_id,
          currentChat?.chats?.[findChatIndex + 1]?.message?.id
        );
      }
      const temp: ChatI = {
        ...chat,
        from_user: chatBotDetails.userDetails,
        message: {
          action_id: action?.action_id,
          id: action?.action_id,
          type: "string",
          value: action?.value,
        },
        isLoading: true,
        actions: [],
      };

      addMessage(chat?.chat_id, temp);
      await suspenseDelay(2000);
      updateMessage(
        chat?.chat_id,
        action?.action_id,
        {
          ...temp,
          isLoading: false,
        },
        true
      );
      handleActionsDisable(false);
    },
    [currentChat]
  );

  const onDeleteAction = useCallback(async (chat: ChatI) => {
    console.log(chat, "ccc");
    updateMessage(chat?.chat_id, chat?.message?.id, {
      ...chat,
      isLoading: true,
    });
    await suspenseDelay(2000);
    deleteMessage(chat?.chat_id, chat?.message?.id);
  }, []);

  const onInputData = useCallback(
    async (value: string) => {
      handleActionsDisable(true);
      if (inputValue?.messageId) {
        const messageData = currentChat?.chats?.find(
          (e) => e.message?.id === inputValue?.messageId
        );
        
        if (messageData) {
          updateMessage(chatView.currentChat, messageData?.message?.id, {
            ...messageData,
            
            isLoading: true,
          });
          await suspenseDelay(2000);
          setInputValue({
            messageId: "",
            value: "",
          });
          updateMessage(chatView.currentChat, messageData?.message?.id, {
            ...messageData,
            message: {
              ...messageData?.message,
              value,
            },
            isLoading: false,
          });
        }
        handleActionsDisable(false);
      } else {
        const id = makeId({
          length: 8,
        });
        const data: ChatI = {
          chat_id: chatView?.currentChat,
          context: "ONBOARDING",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          from_user: chatBotDetails?.userDetails,
          isLoading: true,
          message: {
            id,
            type: "string",
            value,
          },
        };
        addMessage(chatView?.currentChat, data);
        await suspenseDelay(2000);
        updateMessage(chatView.currentChat, id, { ...data, isLoading: false });
        handleActionsDisable(false);
      }
    },
    [chatView.chats, inputValue]
  );
  const onCancelEdit = useCallback(() => {
    setInputValue({ messageId: "", value: "" });
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      {isValidChat ? (
        <>
          <ChatHeader />
          <section className="flex-1 hide-scroll p-3 overflow-y-auto overflow-x-hidden">
            {isLoading ? (
              <ChatsLoader />
            ) : (
              <MessageRenderer
                chats={chats}
                editItem={inputValue?.messageId}
                onEditValue={setInputValue}
                onCancelEdit={onCancelEdit}
                onDeleteAction={onDeleteAction}
                onSelectAction={onSelectAction}
              />
            )}
          </section>
          {showInputField && (
            <ChatbotInputfield
              onEnter={onInputData}
              inpValue={inputValue?.value}
              disabled={isLoading || actionsDisable}
            />
          )}
        </>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center">
          <H5>Invalid Chat</H5>
          <button onClick={onBackToChats}>Go Home</button>
        </div>
      )}
    </div>
  );
};

export default React.memo(ChatView);

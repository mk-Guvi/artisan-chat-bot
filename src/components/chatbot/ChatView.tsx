import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useChatbot } from "../../providers/chatbotProvider";
import { H5 } from "../Typography";
import {
  ChatbotInputfield,
  ChatHeader,
  ChatsLoader,
  MessagesRenderer,
} from "./chatbotComponents";
import { makeId, useChangeListener } from "../../../utils";
import { ChatActionI, ChatI } from "../../types/chatbot.types";
import { BackendDelete, BackendPost, BackendPut } from "../../integration";
import { backendRoutes } from "../../constants";

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
    chatsListView,
    handleChatsListView,
  } = useChatbot();

  const [changeWatcher, recordChanges] = useChangeListener(500);
  const [chatChangesWatcher, recordChatChanges] = useChangeListener(500);

  const currentChat = useMemo(
    () => chatView?.chats?.[chatView?.currentChat],
    [chatView?.chats, chatView?.currentChat]
  );

  const [inputValue, setInputValue] = useState({
    messageId: "",
    value: "",
    inputChangeWatcher: 0,
  });

  const isValidChat = useMemo(() => Boolean(currentChat), [currentChat]);
  const isLoading = currentChat?.loading;
  const chats = useMemo(() => currentChat?.chats || [], [currentChat?.chats]);
  const lastChat = useMemo(() => {
    recordChatChanges();
    return chats[chats.length - 1];
  }, [chats]);

  const showInputField = useMemo(
    () => !isLoading && !currentChat?.hideInputfield,
    [lastChat?.actions, isLoading, currentChat]
  );

  const handleApiError = (error: any, errorMessage: string) => {
    console.error(error);
    throw new Error(error?.message || errorMessage);
  };

  const getChats = async ({ loading }: { loading: boolean }) => {
    try {
      handleChatViewData(chatView?.currentChat, { loading });
      const response = await BackendPost({
        path: `${backendRoutes.chatbotBase}/${chatView?.currentChat}`,
        data: { context: chatView?.context },
      });

      if (response?.type === "success") {
        handleChatViewData(chatView?.currentChat, {
          loading: false,
          chats: response?.data?.chats || [],
          hideInputfield: response?.data?.has_next === false,
        });
        handleActionsDisable(response?.data?.has_next === false);
      } else {
        handleApiError(response, "Failed to get chat details");
      }
    } catch (e) {
      handleApiError(e, "Failed to get chat details");
      handleChatViewData(chatView?.currentChat, { chats: [], loading: false });
    }
  };

  const getChatbotResponse = async (addTempChat?: boolean) => {
    const tempData: ChatI = {
      chat_id: chatView?.currentChat,
      context: chatView.context,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      from_user: chatBotDetails?.botDetails?.user_id,
      isLoading: true,
      message: {
        id: makeId({ length: 5 }),
        type: "string",
        value: "Thinking...",
      },
    };

    try {
      if (addTempChat) {
        addMessage(currentChat.chatId, tempData);
      }

      const response = await BackendPost({
        path: `${backendRoutes.chatbotBase}/${currentChat.chatId}${backendRoutes.chatbotResponse}`,
        data: { context: chatView.context },
      });

      if (addTempChat) {
        deleteMessage(tempData.chat_id, tempData.message.id);
        handleActionsDisable(true);
      }

      if (response?.type === "success") {
        handleActionsDisable(response?.data?.has_next === false);

        if (response?.data?.chats?.length) {
          handleChatViewData(chatView?.currentChat, {
            loading: false,
            chats: [
              ...(currentChat.chats || []),
              ...(response?.data?.chats || []),
            ],
            hideInputfield: response?.data?.has_next === false,
          });
        }
      } else {
        handleApiError(response, "Failed to get response");
      }
    } catch (e) {
      if (addTempChat) {
        deleteMessage(tempData.chat_id, tempData.message.id);
        handleActionsDisable(false);
      }
      handleApiError(e, "Failed to get response");
    }
  };

  const handleInputValueChange = (value: string, messageId?: string) => {
    setInputValue((prev) => ({
      inputChangeWatcher: prev.inputChangeWatcher + 1,
      messageId: messageId || "",
      value,
    }));
  };

  const onClearEdit = useCallback(() => {
    handleInputValueChange("");
  }, []);

  const deleteMessagesAfter = (id: string) => {
    const findChatIndex = currentChat?.chats?.findIndex(
      (e) => e.message?.id === id
    );

    if (currentChat?.chats?.[findChatIndex + 1]?.message?.id) {
      deleteMessage(
        currentChat?.chats?.[findChatIndex + 1]?.chat_id,
        currentChat?.chats?.[findChatIndex + 1]?.message?.id
      );
    }
  };
  const onSelectAction = useCallback(
    async (chat: ChatI, action: ChatActionI) => {
      try {
        handleActionsDisable(true);
        handleInputValueChange("", "");

        deleteMessagesAfter(chat?.message?.id);

        const temp: ChatI = {
          ...chat,
          from_user: chatBotDetails.userDetails?.user_id,
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

        const response = await BackendPost({
          path: `${backendRoutes.chatbotBase}/${currentChat.chatId}${backendRoutes.addChat}`,
          data: {
            context: chatView.context,
            from_message_id: chat?.message?.id || "",
            message: {
              action_id: action?.action_id || "",
              type: "string",
              value: action?.value,
            },
          },
        });

        if (response?.type === "success") {
          updateMessage(
            chat?.chat_id,
            action?.action_id,
            {
              ...response?.data,
              isLoading: false,
            },
            true
          );
          recordChanges();
        } else {
          handleApiError(response, "Failed to submit action");
        }
      } catch (e) {
        handleApiError(e, "Failed to submit action");
      } finally {
        handleActionsDisable(false);
      }
    },
    [currentChat, chatView.context, chatBotDetails.userDetails?.user_id]
  );

  const onDeleteAction = useCallback(
    async (chat: ChatI) => {
      try {
        updateMessage(chat?.chat_id, chat?.message?.id, {
          ...chat,
          isLoading: true,
        });
        handleActionsDisable(true);

        const response = await BackendDelete({
          path: `${backendRoutes.chatbotBase}/${currentChat.chatId}${backendRoutes.deleteChatMessage}`,
          data: {
            message_id: chat?.message?.id,
            context: chatView.context,
          },
        });

        if (response?.type === "success") {
          deleteMessage(chat?.chat_id, chat?.message?.id);
          recordChanges();
        } else {
          handleApiError(response, "Failed to delete chat message");
        }
      } catch (e) {
        handleApiError(e, "Failed to delete chat message");
        updateMessage(chat?.chat_id, chat?.message?.id, {
          ...chat,
          isLoading: false,
        });
      } finally {
        handleActionsDisable(false);
      }
    },
    [currentChat, chatView.context]
  );

  const onInputData = useCallback(
    async (value: string) => {
      try {
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

            const response = await BackendPut({
              path: `${backendRoutes.chatbotBase}/${currentChat.chatId}${backendRoutes.updateChatMessage}`,
              data: {
                message_id: messageData?.message?.id,
                context: chatView.context,
                message: {
                  type: "string",
                  value,
                },
              },
            });

            if (response?.type === "success") {
              onClearEdit();
              deleteMessagesAfter(messageData?.message?.id);
              updateMessage(chatView.currentChat, messageData?.message?.id, {
                ...response?.data,
                isLoading: false,
              });
              recordChanges();
            } else {
              handleInputValueChange(value, messageData?.message?.id);
              updateMessage(chatView.currentChat, messageData?.message?.id, {
                ...messageData,
                isLoading: false,
              });
              handleApiError(response, "Failed To Update");
            }
          }
        } else {
          const id = makeId({ length: 8 });
          const data: ChatI = {
            chat_id: chatView?.currentChat,
            context: chatView.context,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            from_user: chatBotDetails?.userDetails?.user_id,
            isLoading: true,
            message: {
              id,
              type: "string",
              value,
            },
          };

          addMessage(chatView?.currentChat, data);

          const response = await BackendPost({
            path: `${backendRoutes.chatbotBase}/${currentChat.chatId}${backendRoutes.addChat}`,
            data: {
              context: chatView.context,
              message: {
                type: "string",
                value: value,
              },
            },
          });

          if (response?.type === "success") {
            updateMessage(chatView.currentChat, id, {
              ...response?.data,
              isLoading: false,
            });
            recordChanges();
          } else {
            handleInputValueChange(value);
            deleteMessage(chatView.currentChat, id);
            handleApiError(response, "Failed to add message");
          }
        }
      } catch (e) {
        handleApiError(e, "Failed to process input");
      } finally {
        handleActionsDisable(false);
      }
    },
    [
      chatView.chats,
      inputValue,
      currentChat,
      chatBotDetails?.userDetails?.user_id,
    ]
  );

  useEffect(() => {
    if (changeWatcher) {
      getChatbotResponse();
    }
  }, [changeWatcher]);

  useEffect(() => {
    if (isValidChat) {
      if (!chats.length) {
        getChats({ loading: true });
      }
      recordChanges();
    }
  }, [isValidChat, chatView.currentChat]);

  useEffect(() => {
    if (chatChangesWatcher) {
      const currentChatsLength = currentChat?.chats?.length || 0;
      if (currentChatsLength) {
        const updated_chats = chatsListView?.chats?.map((e) =>
          e?.chat_id === currentChat?.chatId &&
          e?.message?.id !==
            currentChat?.chats[currentChatsLength - 1]?.message?.id
            ? currentChat?.chats[currentChatsLength - 1]
            : e
        );

        if (
          updated_chats.some(
            (chat, index) => chat !== chatsListView?.chats[index]
          )
        ) {
          handleChatsListView({ chats: updated_chats });
        }
      }
    }
  }, [chatChangesWatcher, currentChat, chatsListView]);

  if (!isValidChat) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center">
        <H5>Invalid Chat</H5>
        <button onClick={onBackToChats}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <ChatHeader />
      <section className="flex-1 hide-scroll p-3 overflow-y-auto overflow-x-hidden">
        {isLoading ? (
          <ChatsLoader />
        ) : (
          <MessagesRenderer
            chats={chats}
            editItem={inputValue?.messageId}
            onEditValue={handleInputValueChange}
            onCancelEdit={onClearEdit}
            onDeleteAction={onDeleteAction}
            onSelectAction={onSelectAction}
          />
        )}
      </section>
      {showInputField && (
        <ChatbotInputfield
          onEnter={onInputData}
          inpValue={inputValue?.value}
          inputChangeWatcher={inputValue?.inputChangeWatcher}
          disabled={isLoading || actionsDisable}
        />
      )}
    </div>
  );
};

export default React.memo(ChatView);

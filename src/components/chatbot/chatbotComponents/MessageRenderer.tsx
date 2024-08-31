import React, { useEffect, useMemo, useRef, useState } from "react";
import { ExtraSmallText,  } from "../../Typography";
import { Icon } from "../../Icons";
import { ChatActionI, ChatI } from "../../../types/chatbot.types";
import { CircularLoader } from "../../loaders";
import { useChatbot } from "../../../providers/chatbotProvider";

interface MessageRendererProps {
  chat: ChatI;
  onSelectAction: (chat: ChatI, action: ChatActionI) => Promise<void>;
  onDeleteAction: (chat: ChatI) => Promise<void>;
  editItem: string;
  onCancelEdit: () => void;
  onEditValue: (value: string, messageId: string) => void;
  loadingAction: string;
  setLoadingAction: (val: string) => void;
}

const MessageRenderer: React.FC<MessageRendererProps> = ({
  chat,
  onSelectAction,
  onDeleteAction,
  editItem,
  onCancelEdit,
  onEditValue,
  loadingAction,
  setLoadingAction,
}) => {
  const { actionsDisable, chatBotDetails } = useChatbot();

  const renderActionButtons = () => (
    <div className="flex items-center gap-2 pb-2 flex-wrap max-w-[75%]">
      {chat.actions?.map((action) => (
        <button
          key={action.action_id}
          disabled={actionsDisable || loadingAction === action.action_id}
          onClick={async (e) => {
            e.stopPropagation();
            setLoadingAction(action.action_id);
            await onSelectAction(chat, action);
            setLoadingAction("");
          }}
          className={`border p-2 px-4 text-xs flex items-center justify-center relative rounded-3xl text-purple-700 border-purple-600 bg-purple-50 ${
            actionsDisable ? "cursor-not-allowed" : ""
          }`}
        >
          <CircularLoader
            className={`absolute ${
              loadingAction === action.action_id ? "block" : "hidden"
            } !h-4 !w-4 text-purple-800`}
          />
          <ExtraSmallText
            className={loadingAction === action.action_id ? "opacity-0" : ""}
          >
            {action.value}
          </ExtraSmallText>
        </button>
      ))}
    </div>
  );

  const renderEditButtons = () => (
    <div
      className={`${
        editItem === chat.message.id ? "flex" : "group-hover:flex hidden"
      } flex-wrap text-gray-500 justify-center mt-auto mb-2 items-center gap-0.5`}
    >
      {!editItem && (
        <Icon
          icon="trash-2"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteAction(chat);
          }}
          className="!h-5 !w-5 hover:text-red-600 hover:bg-red-100 p-1 rounded-md cursor-pointer"
        />
      )}
      {!chat.message.action_id && (
        <Icon
          icon={editItem === chat.message.id ? "x" : "edit-2"}
          onClick={(e) => {
            e.stopPropagation();
            if (editItem === chat.message.id) {
              onCancelEdit();
            } else {
              onEditValue(chat.message.value, chat.message.id);
            }
          }}
          className="!h-5 !w-5 hover:text-blue-600 hover:bg-blue-100 p-1 rounded-md cursor-pointer"
        />
      )}
    </div>
  );
  const getUserDetails = useMemo(() => {
    return chatBotDetails?.userDetails?.user_id === chat?.from_user
      ? chatBotDetails?.userDetails||{}
      : chatBotDetails?.botDetails||{};
  }, [chat?.from_user, chatBotDetails]);
  return (
    <div className="flex flex-col gap-2" id={chat?.message?.id}>
      <div
        className={`flex group transition-all duration-300 pb-2 text-purple-800 items-start gap-1.5 relative ${
          getUserDetails?.is_bot ? "justify-start" : "justify-end"
        }`}
      >
        {getUserDetails?.is_bot ? (
          <div
            className={`h-8 w-8 mt-1.5 ${
              chat.isLoading ? "flex items-center justify-center" : ""
            } rounded-lg relative`}
          >
            <img
              alt={getUserDetails?.name}
              src={getUserDetails.profile_image}
              className={`${
                chat.isLoading ? "opacity-0" : ""
              } h-full w-full rounded-lg object-contain`}
            />
            <CircularLoader
              className={`text-purple-800 absolute !h-4 !w-4 ${
                chat.isLoading ? "block" : "hidden"
              }`}
            />
          </div>
        ) : chat.isLoading || actionsDisable ? null : (
          renderEditButtons()
        )}

        <ExtraSmallText className="p-2 px-4 bg-purple-50 max-w-[70%] rounded-md">
          {chat.message.value}
        </ExtraSmallText>

        {!getUserDetails?.is_bot && (
          <div
            className={`h-8 w-8 mt-1.5 ${
              chat.isLoading ? "flex items-center justify-center" : ""
            } relative`}
          >
            <img
              alt={getUserDetails?.name}
              src={getUserDetails?.profile_image}
              className={`${
                chat.isLoading ? "opacity-0" : ""
              } h-full w-full rounded-lg object-contain`}
            />
            <CircularLoader
              className={`text-purple-800 absolute !h-4 !w-4 ${
                chat.isLoading ? "block" : "hidden"
              }`}
            />
          </div>
        )}
      </div>
      {chat?.actions && chat?.actions?.length > 0
        ? renderActionButtons()
        : null}
    </div>
  );
};

interface MessagesRendererProps {
  chats: ChatI[];
  onSelectAction: (chat: ChatI, action: ChatActionI) => Promise<void>;
  onDeleteAction: (chat: ChatI) => Promise<void>;
  editItem: string;
  onCancelEdit: () => void;
  onEditValue: (value: string, messageId: string) => void;
}

export const MessagesRenderer: React.FC<MessagesRendererProps> = ({
  chats,
  onSelectAction,
  onDeleteAction,
  editItem,
  onCancelEdit,
  onEditValue,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loadingAction, setLoadingAction] = useState("");
  useEffect(() => {
    const getLoadingItem = chats?.find((e) => e.isLoading);
    if (getLoadingItem) {
      const element = document.getElementById(getLoadingItem?.message?.id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      {chats.map((chat) => (
        <MessageRenderer
          key={chat.message.id}
          setLoadingAction={setLoadingAction}
          loadingAction={loadingAction}
          chat={chat}
          onSelectAction={onSelectAction}
          onDeleteAction={onDeleteAction}
          editItem={editItem}
          onCancelEdit={onCancelEdit}
          onEditValue={onEditValue}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

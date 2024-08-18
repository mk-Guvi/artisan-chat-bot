import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { ChatI } from "../types/chatbot.types";
import {
  ChatBotIcon,
  dummyData,
} from "../components/chatbot/chatbotComponents";
import ChatbotContainer from "../components/chatbot/ChatbotContainer";
import { makeId, suspenseDelay } from "../../utils";
import { LANG } from "../constants";

interface ChatbotProviderProps {
  children: React.ReactNode;
}

export interface ChatViewData {
  loading: boolean;
  chats: ChatI[];
  chatId: string;
  page: number;
  count: number;
  hideInputfield: boolean;
}

interface ChatBotState {
  open: boolean;
  route: "chats" | "chat-view";
  chatBotDetails: {
    userDetails: ChatI["user"];
    botDetails: ChatI["user"];
    show: boolean;
  };

  chatsListView: {
    loading: boolean;
    chats: ChatI[];
  };
  chatView: {
    chats: Record<string, ChatViewData>;
    currentChat: string;
    context: "ONBOARDING";
  };
  actionsDisable: boolean;
}

type Action =
  | { type: "TOGGLE_CHAT" }
  | { type: "SET_ROUTE"; payload: "chats" | "chat-view" }
  | {
      type: "UPDATE_CHATS_LIST_VIEW";
      payload: Partial<ChatBotState["chatsListView"]>;
    }
  | {
      type: "UPDATE_CHAT_VIEW_DATA";
      payload: { chatId: string; data: Partial<ChatViewData> };
    }
  | { type: "SET_CURRENT_CHAT"; payload: string }
  | { type: "SET_ACTION_DISABLE"; payload: boolean }
  | {
      type: "ROUTE_TO_CHATVIEW";
      payload: { chatId: string; chatData: Partial<ChatViewData> };
    }
  | {
      type: "ADD_MESSAGE";
      payload: { chatId: string; message: ChatI };
    }
  | {
      type: "DELETE_MESSAGE";
      payload: { chatId: string; messageId: string };
    }
  | {
      type: "ADD_NEW_CHAT";
      payload: ChatI;
    }
  | {
      type: "UPDATE_MESSAGE";
      payload: {
        chatId: string;
        messageId: string;
        updatedMessage: Partial<ChatI>;
        clearAfter: boolean;
      };
    }
  | {
      type: "UPDATE_CHATBOT_DETAILS";
      payload: Partial<ChatBotState["chatBotDetails"]>;
    };

// Initial state
const initialState: ChatBotState = {
  open: false,
  route: "chats",
  chatsListView: { loading: true, chats: [] },
  chatView: { chats: {}, currentChat: "", context: "ONBOARDING" },
  actionsDisable: false,
  chatBotDetails: {
    botDetails: {
      is_bot: true,
      name: LANG.CHATBOT.CHATBOT_NAME,
      profile_image:
        "data:image/jpeg;base64,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",
    },
    show: false,
    userDetails: {
      is_bot: false,
      name: "Musharaf",
      profile_image: "https://github.com/shadcn.png",
    },
  },
};

const defaultChatViewState: ChatViewData = {
  loading: true,
  chats: [],
  chatId: "",
  page: 1,
  count: 50,
  hideInputfield: false,
};

function chatbotReducer(state: ChatBotState, action: Action): ChatBotState {
  switch (action.type) {
    case "TOGGLE_CHAT":
      return { ...state, open: !state.open };
    case "ADD_NEW_CHAT": {
      return {
        ...state,
        chatsListView: {
          ...state.chatsListView,
          chats: [action.payload, ...state.chatsListView.chats],
        },
        route: "chat-view",
        chatView: {
          currentChat: action?.payload?.chat_id,
          context: "ONBOARDING",
          chats: {
            ...state.chatView.chats,
            [action.payload.chat_id]: {
              chatId: action.payload.chat_id,
              chats: [action.payload],
              loading: false,
              count: 100,
              page: 1,
              hideInputfield: false,
            },
          },
        },
      };
    }

    case "UPDATE_CHATBOT_DETAILS": {
      return {
        ...state,
        chatBotDetails: {
          ...state.chatBotDetails,
          ...action.payload,
        },
      };
    }
    case "SET_ROUTE":
      return { ...state, route: action.payload };
    case "UPDATE_CHATS_LIST_VIEW":
      return {
        ...state,
        chatsListView: { ...state.chatsListView, ...action.payload },
      };
    case "UPDATE_CHAT_VIEW_DATA":
      return {
        ...state,
        chatView: {
          ...state.chatView,
          chats: {
            ...state.chatView.chats,
            [action.payload.chatId]: {
              ...state.chatView.chats[action.payload.chatId],
              ...action.payload.data,
            },
          },
        },
      };
    case "SET_CURRENT_CHAT":
      return {
        ...state,
        chatView: { ...state.chatView, currentChat: action.payload },
      };
    case "SET_ACTION_DISABLE":
      return { ...state, actionsDisable: action.payload };
    case "ROUTE_TO_CHATVIEW":
      return {
        ...state,
        route: "chat-view",
        chatView: {
          ...state.chatView,
          currentChat: action.payload.chatId,
          chats: {
            ...state.chatView.chats,
            [action.payload.chatId]: {
              ...defaultChatViewState,
              ...state.chatView.chats[action.payload.chatId],
              ...action.payload.chatData,
            },
          },
        },
      };
    case "ADD_MESSAGE":
      return {
        ...state,
        chatView: {
          ...state.chatView,
          chats: {
            ...state.chatView.chats,
            [action.payload.chatId]: {
              ...state.chatView.chats[action.payload.chatId],
              chats: [
                ...state.chatView.chats[action.payload.chatId].chats,
                action.payload.message,
              ],
            },
          },
        },
      };

    case "DELETE_MESSAGE": {
      const chatId = action.payload.chatId;
      const messageId = action.payload.messageId;

      const indexToDelete = state.chatView.chats[chatId].chats.findIndex(
        (chat) => chat.message.id === messageId
      );

      const updatedChats = state.chatView.chats[chatId].chats.slice(
        0,
        indexToDelete
      );

      return {
        ...state,
        chatView: {
          ...state.chatView,
          chats: {
            ...state.chatView.chats,
            [chatId]: {
              ...state.chatView.chats[chatId],
              chats: updatedChats,
            },
          },
        },
      };
    }
    case "UPDATE_MESSAGE":
      return {
        ...state,
        chatView: {
          ...state.chatView,
          chats: {
            ...state.chatView.chats,
            [action.payload.chatId]: {
              ...state.chatView.chats[action.payload.chatId],
              chats: state.chatView.chats[action.payload.chatId].chats.map(
                (chat) =>
                  chat.message.id === action.payload.messageId
                    ? { ...chat, ...action.payload.updatedMessage }
                    : chat
              ),
            },
          },
        },
      };
    default:
      return state;
  }
}

interface ChatbotContextValue extends ChatBotState {
  toggleChat: () => void;
  onBackToChats: () => void;
  handleChatViewData: (chatId: string, data: Partial<ChatViewData>) => void;
  onCreateChat: () => Promise<void>;
  handleChatsListView: (data: Partial<ChatBotState["chatsListView"]>) => void;
  handleChatBotDetails: (data: Partial<ChatBotState["chatBotDetails"]>) => void;
  handleActionsDisable: (data: boolean) => void;
  getChats: () => Promise<void>;
  onRouteToChatview: (chat: ChatI) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  addMessage: (chatId: string, message: ChatI) => void;
  updateMessage: (
    chatId: string,
    messageId: string,
    updatedMessage: Partial<ChatI>,
    clearAfter?: boolean
  ) => void;
}

const ChatbotContext = createContext<ChatbotContextValue | undefined>(
  undefined
);

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(chatbotReducer, initialState);

  useEffect(() => {
    if (!state?.chatBotDetails?.show) {
      getChatDetails();
    }
  }, []);

  const toggleChat = useCallback(() => dispatch({ type: "TOGGLE_CHAT" }), []);

  const onBackToChats = useCallback(() => {
    dispatch({ type: "SET_ROUTE", payload: "chats" });
    if (state.chatView.currentChat) {
      dispatch({
        type: "UPDATE_CHAT_VIEW_DATA",
        payload: {
          chatId: state.chatView.currentChat,
          data: { loading: false },
        },
      });
    }
    dispatch({ type: "SET_CURRENT_CHAT", payload: "" });
  }, [state.chatView.currentChat]);

  const handleChatViewData = useCallback(
    (chatId: string, data: Partial<ChatViewData>) => {
      dispatch({ type: "UPDATE_CHAT_VIEW_DATA", payload: { chatId, data } });
    },
    []
  );

  const handleChatsListView = useCallback(
    (data: Partial<ChatBotState["chatsListView"]>) => {
      dispatch({ type: "UPDATE_CHATS_LIST_VIEW", payload: data });
    },
    []
  );

  const handleActionsDisable = useCallback((data: boolean) => {
    dispatch({ type: "SET_ACTION_DISABLE", payload: data });
  }, []);
  const handleChatBotDetails = useCallback(
    (payload: Partial<ChatBotState["chatBotDetails"]>) => {
      dispatch({
        type: "UPDATE_CHATBOT_DETAILS",
        payload,
      });
    },
    []
  );
  const deleteMessage = useCallback((chatId: string, messageId: string) => {
    dispatch({
      type: "DELETE_MESSAGE",
      payload: { chatId, messageId },
    });
  }, []);

  const updateMessage = useCallback(
    (
      chatId: string,
      messageId: string,
      updatedMessage: Partial<ChatI>,
      clearAfter: boolean = false
    ) => {
      dispatch({
        type: "UPDATE_MESSAGE",
        payload: { chatId, messageId, updatedMessage, clearAfter },
      });
    },
    []
  );

  const addMessage = useCallback((chatId: string, message: ChatI) => {
    dispatch({
      type: "ADD_MESSAGE",
      payload: { chatId, message },
    });
  }, []);

  const getChats = useCallback(async () => {
    try {
      handleChatsListView({ loading: true });
      await suspenseDelay(2000);
      handleChatsListView({
        chats: [dummyData],
      });
    } catch (e) {
      console.error(e);
      handleChatsListView({ chats: [] });
    } finally {
      handleChatsListView({ loading: false });
    }
  }, [handleChatsListView]);

  const getChatDetails = useCallback(async () => {
    try {
      await suspenseDelay(2000);
      handleChatBotDetails({
        show: true,
      });
    } catch (e) {
      console.error(e);
    }
  }, [handleChatsListView]);

  const onRouteToChatview = useCallback((chat: ChatI) => {
    dispatch({
      type: "ROUTE_TO_CHATVIEW",
      payload: {
        chatId: chat.chat_id,
        chatData: {
          chatId: chat.chat_id,
        },
      },
    });
  }, []);
  const onCreateChat = useCallback(async () => {
    await suspenseDelay(1000);
    const chatId = makeId({
      prefixText: "chat-id",
    });
    const data = {
      ...dummyData,
      actions: [],
      chat_id: chatId,
    };
    dispatch({
      type: "ADD_NEW_CHAT",
      payload: data,
    });
  }, []);
  const contextValue = useMemo(
    () => ({
      ...state,
      toggleChat,
      onBackToChats,
      handleChatViewData,
      handleChatsListView,
      getChats,
      onRouteToChatview,
      handleActionsDisable,
      deleteMessage,
      updateMessage,
      addMessage,
      onCreateChat,
      handleChatBotDetails,
    }),
    [
      state,
      onCreateChat,
      toggleChat,
      onBackToChats,
      handleChatViewData,
      handleChatsListView,
      getChats,
      onRouteToChatview,
      handleActionsDisable,
      deleteMessage,
      updateMessage,
      addMessage,
      handleChatBotDetails,
    ]
  );

  return (
    <ChatbotContext.Provider value={contextValue}>
      {children}
      <ChatbotContainer />
      {state.chatBotDetails?.show ? <ChatBotIcon /> : null}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within the ChatbotProvider");
  }
  return context;
};

export default ChatbotProvider;

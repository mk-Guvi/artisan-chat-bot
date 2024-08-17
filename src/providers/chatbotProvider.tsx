import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { ChatI } from "../types/chatbot.types";
import {
  ChatBotIcon,
  dummyData,
} from "../components/chatbot/chatbotComponents";
import ChatbotContainer from "../components/chatbot/ChatbotContainer";
import { suspenseDelay } from "../../utils";

interface ChatbotProviderPropsI {
  children: React.ReactNode;
}

export interface ChatViewStateT {
  loading: boolean;
  chats: ChatI[];
  chatId: string;
  page: number;
  count: number;
  hideInputfield: boolean;
}
export interface ChatBotStateI {
  open: boolean;
  route: "chats" | "chat-view";
  chatsListView: {
    loading: boolean;
    chats: ChatI[];
    page: number;
    count: number;
  };
  chatView: ChatViewStateT;
}
const initialState: ChatBotStateI = {
  open: false,
  route: "chats",
  chatsListView: {
    loading: true,
    chats: [],
    page: 1,
    count: 50,
  },
  chatView: {
    chats: [],
    chatId: "",
    hideInputfield: false,
    loading: true,
    page: 1,
    count: 50,
  },
};
interface ChatbotContextI {
  handleState: (payload: Partial<ChatBotStateI>) => void;
  handleChatView: (payload: Partial<ChatBotStateI["chatView"]>) => void;
  handleChatsListView: (
    payload: Partial<ChatBotStateI["chatsListView"]>
  ) => void;
  toggleChat: () => void;
  onBackToChats: () => void;
  chatbot: ChatBotStateI;
  getChats: () => Promise<void>;
}
export const ChatbotContext = createContext<ChatbotContextI>({
  handleState: () => {},
  toggleChat: () => {},
  handleChatView: () => {},
  onBackToChats: () => {},
  handleChatsListView: () => {},
  getChats: async () => {},
  chatbot: initialState,
});

const ChatbotProvider: React.FC<ChatbotProviderPropsI> = ({ children }) => {
  const [state, setState] = useState<ChatBotStateI>(initialState);

  const handleState = useCallback((payload: Partial<ChatBotStateI>) => {
    setState((prev) => ({ ...prev, ...payload }));
  }, []);

  const handleChatView = useCallback(
    (payload: Partial<ChatBotStateI["chatView"]>) => {
      setState((prev) => ({
        ...prev,
        chatView: { ...prev.chatView, ...payload },
      }));
    },
    []
  );

  const toggleChat = useCallback(() => {
    setState((prev) => ({ ...prev, open: !prev.open }));
  }, []);
  const onBackToChats = useCallback(() => {
    setState((prev) => ({ ...prev, route: "chats" }));
  }, []);
  const handleChatsListView = useCallback(
    (payload: Partial<ChatBotStateI["chatsListView"]>) => {
      setState((prev) => ({
        ...prev,
        chatsListView: {
          ...prev.chatsListView,
          ...payload,
        },
      }));
    },
    []
  );
  const getChats = useCallback(async () => {
    try {
      handleChatsListView({ loading: true });
      await suspenseDelay(2000);
      handleChatsListView({
        chats: [dummyData],
        count: 100,
        page: 1,
      });
      // const response = await BackendGet({
      //   path: backendRoutes.chatLists,
      //   queryParams: {
      //     page: state.chatsListView.page,
      //     count: state.chatsListView.count,
      //   },
      // });
    } catch (e) {
      console.log(e);
      handleChatsListView({ chats: [] });
    } finally {
      handleChatsListView({ loading: false });
    }
  }, [state.chatsListView]);
  const contextValue = useMemo(
    () => ({
      chatbot: state,
      handleState,
      toggleChat,
      handleChatView,
      onBackToChats,
      handleChatsListView,
      getChats,
    }),
    [
      state,
      handleChatsListView,
      handleState,
      handleChatView,
      onBackToChats,
      toggleChat,
      getChats,
    ]
  );

  return (
    <ChatbotContext.Provider value={contextValue}>
      {children}
      <ChatbotContainer />
      <ChatBotIcon />
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

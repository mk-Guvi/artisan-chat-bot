import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { ChatI } from "../types/chatbot.types";
import { ChatBotIcon } from "../components/chatbot/chatbotComponents";

interface ChatbotProviderPropsI {
  children: React.ReactNode;
}

export interface ChatViewStateT {
  loading: boolean;
  chats: ChatI[];
  hideInputfield: boolean;
}
export interface ChatBotStateI {
  open: boolean;
  route: "chats" | "chat-view";
  chats_list: ChatI[];
  chatView: ChatViewStateT;
}
const initialState: ChatBotStateI = {
  open: false,
  route: "chats",
  chats_list: [],
  chatView: {
    chats: [],
    hideInputfield: false,
    loading: true,
  },
};
interface ChatbotContextI {
  handleState: (payload: Partial<ChatBotStateI>) => void;
  handleChatView: (payload: Partial<ChatBotStateI["chatView"]>) => void;
  toggleChat: () => void;
  onBackToChats: () => void;
  chatbot: ChatBotStateI;
}
export const ChatbotContext = createContext<ChatbotContextI>({
  handleState: () => {},
  toggleChat: () => {},
  handleChatView: () => {},
  onBackToChats: () => {},
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

  const contextValue = useMemo(
    () => ({
      chatbot: state,
      handleState,
      toggleChat,
      handleChatView,
      onBackToChats,
    }),
    [state, handleState, handleChatView, onBackToChats, toggleChat]
  );

  return (
    <ChatbotContext.Provider value={contextValue}>
      {children}
      <ChatBotIcon/>
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

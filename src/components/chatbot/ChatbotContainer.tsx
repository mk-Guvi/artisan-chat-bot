import { useChatbot } from "../../providers/chatbotProvider";
import ChatListView from "./ChatListView";
import ChatView from "./ChatView";

function ChatbotContainer() {
  const { chatbot } = useChatbot();
  return chatbot?.open ? (
    <div className="fixed bottom-0 right-0 flex flex-col sm:bottom-[4.5rem] sm:right-6 transition duration-200 bg-white shadow-2xl border sm:rounded-lg h-full w-screen  sm:h-[85%]  sm:w-[20rem]">
      {chatbot?.route === "chat-view" ? <ChatView /> : <ChatListView />}
    </div>
  ) : null;
}

export default ChatbotContainer;

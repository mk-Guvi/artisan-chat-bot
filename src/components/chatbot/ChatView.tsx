import { useChatbot } from "../../providers/chatbotProvider";
import { H1 } from "../Typography";

function ChatView() {
  const {
    onBackToChats,
    chatbot: { chatView },
  } = useChatbot();
  return (
    <div className="h-full w-full flex flex-col">
      {chatView?.chatId ? (
        <div></div>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center">
          <H1>Invalid Chat</H1>
          <button onClick={onBackToChats}>Go Home</button>
        </div>
      )}
    </div>
  );
}

export default ChatView;



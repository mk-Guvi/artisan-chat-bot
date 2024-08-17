import { useCallback, useEffect } from "react";
import { useChatbot } from "../../providers/chatbotProvider";
import { H1 } from "../Typography";
import {
  ChatbotInputfield,
  ChatHeader,
  ChatsLoader,
  dummyData,
  MessageRenderer,
} from "./chatbotComponents";
import { suspenseDelay } from "../../../utils";

function ChatView() {
  const {
    onBackToChats,
    chatbot: { chatView },
    handleChatView,
  } = useChatbot();
  useEffect(() => {
    getChats();
  }, [chatView?.chatId]);

  const getChats = useCallback(async () => {
    try {
      handleChatView({ loading: true });
      await suspenseDelay(2000);
      handleChatView({
        chats: [
          dummyData,
          {
            ...dummyData,
            chat_id: "sad",
            message:{
              id:"sacsada",
              type:"string",
              value:"Hello Ai"
            },
            user: {
              name: "musharaf",
              profileImage: "https://github.com/shadcn.png",
              is_bot: false,
            },
          },
        ],
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
      handleChatView({ chats: [] });
    } finally {
      handleChatView({ loading: false });
    }
  }, []);
  return (
    <div className="h-full w-full flex flex-col">
      {chatView?.chatId ? (
        <>
          <ChatHeader />
          <section className="flex-1 overflow-y-auto overflow-x-hidden">
            {chatView?.loading ? (
              <ChatsLoader />
            ) : (
              <MessageRenderer />
            )}
          </section>
          {!chatView?.hideInputfield ? (
            <ChatbotInputfield
              onEnter={() => {}}
              disabled={chatView?.loading}
            />
          ) : null}
        </>
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

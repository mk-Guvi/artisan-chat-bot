import React, { useState } from "react";
import { CircularLoader } from "../../loaders";
import { BackendGet } from "../../../integration";
import {suspenseDelay} from "../../../../utils/index"
import { backendRoutes, LANG } from "../../../constants";
import { useChatbot } from "../../../providers/chatbotProvider";
import { ChatI } from "../../../types/chatbot.types";
export const dummyData:ChatI={
    chat_id:"1231",
    context:"ONBOARDING",
    created_at:'2024-08-17T16:39:59.151Z',
    updated_at:'2024-08-17T16:39:59.151Z',
    message:{
        type:"string",
        value:LANG.CHATBOT.ASK_A_QUESTION
    },
    user:{
        is_bot:true,
        name:'Artisan',
        profileImage:''
    }
}
export function CreateChatButton() {
  const [loading, setLoading] = useState(false);
  const { getChats } = useChatbot();
  const onCreateChat = async () => {
    try {
      setLoading(true);
      await suspenseDelay(2000)
      
    //   const response = await BackendGet({
    //     path: backendRoutes.createChat,
    //   });

    //   if (response?.data?.chat_id) {
    //     await getChats();
    //   } else {
    //     throw new Error(response?.message || "Failed to Create Chat");
    //   }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={onCreateChat}
      disabled={loading}
      className={`p-2 rounded-lg w-16 h-10 flex items-center justify-center bg-purple-200/30 px-6 ${
        loading ? "cursor-not-allowed" : "hover:drop-shadow-lg"
      }  text-purple-800`}
    >
      {loading ? <CircularLoader className="text-inherit h-4 w-4" /> : "Ask"}
    </button>
  );
}

import React, { useState } from "react";
import { CircularLoader } from "../../loaders";
import { LANG } from "../../../constants";

import { ChatI } from "../../../types/chatbot.types";
import { useChatbot } from "../../../providers/chatbotProvider";
export const dummyData: ChatI = {
  chat_id: "1231",
  context: "ONBOARDING",
  created_at: "2024-08-17T16:39:59.151Z",
  updated_at: "2024-08-17T16:39:59.151Z",
  message: {
    type: "string",
    id: "sac",
    value: LANG.CHATBOT.ASK_A_QUESTION,
  },
  user: {
    is_bot: true,
    name: "Artisan",
    profile_image:
      "data:image/jpeg;base64,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",
  },
};
export function CreateChatButton({ label }: { label?: string }) {
  const [loading, setLoading] = useState(false);
  const { onCreateChat } = useChatbot();
  const onAddChat = async () => {
    setLoading(true);
    await onCreateChat();
    setLoading(false);
  };
  return (
    <button
      onClick={onAddChat}
      disabled={loading}
      className={`p-2 rounded-lg w-28 text-sm font-medium min-h-9 flex items-center justify-center bg-purple-200/30 px-6 ${
        loading ? "cursor-not-allowed" : "hover:drop-shadow-lg"
      }  text-purple-800`}
    >
      {loading ? (
        <CircularLoader className="text-inherit !h-4 !w-4" />
      ) : (
        label || "Ask"
      )}
    </button>
  );
}

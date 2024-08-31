import  { useState } from "react";
import { CircularLoader } from "../../loaders";

import { useChatbot } from "../../../providers/chatbotProvider";

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
      className={`p-2 rounded-lg w-28 text-sm font-medium min-h-9 z-10 relative  flex items-center justify-center bg-purple-100 px-6 ${
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

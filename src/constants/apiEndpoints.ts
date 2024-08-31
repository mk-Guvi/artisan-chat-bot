const basePath = "/api/v1";
export const backendRoutes = {
  chatbotBase: `${basePath}/chatbot`,
  createChat: `${basePath}/chatbot/create_chat`,
  addChat: `/add_chat`,
  deleteChatMessage: `/delete_chat_message`,
  updateChatMessage: `/update_chat_message`,
  chatbotResponse:`/get_response`,
  userBase:`${basePath}/user`,
  chatbotUser:`${basePath}/user/chatbot`
} as const;


const basePath = "/api/v1";
export const backendRoutes = {
  chatLists: `${basePath}/chatbot/chat-list`,
  createChat:`${basePath}/chatbot/createChat`
} as const;

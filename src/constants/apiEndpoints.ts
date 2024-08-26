const basePath = "/api/v1";
export const backendRoutes = {
  chatLists: `${basePath}/chatbot`,
  createChat:`${basePath}/chatbot/create_chat`
} as const;

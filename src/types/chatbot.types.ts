export interface ChatActionI {
  type: "BUTTON" | "FILE";
  value: string;
  action_id: string;
}
export interface UserI {
  name: string;
  profile_image: string;
  is_bot: boolean;
  user_id: string;
}

export interface ChatI {
  from_user: string;

  chat_id: string;
  context: "ONBOARDING";
  created_at: string;
  updated_at: string;
  message: {
    id: string;
    type: "string" | "HTML";
    value: string;
    action_id?: string;
  };
  actions?: ChatActionI[];
  isLoading?: boolean;
}

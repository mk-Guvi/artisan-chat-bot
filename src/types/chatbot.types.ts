export interface ChatActionI {
  type: "BUTTON" | "FILE";
  label: string;
  value: string;
}

export interface ChatI {
  user: {
    name: string;
    profileImage: string;
    is_bot: boolean;
  };
  
  chat_id: string;
  context: "ONBOARDING";
  created_at: string;
  updated_at: string;
  message: {
    id:string
    type: "string" | "HTML";
    value: string;
  };
  actions?: ChatActionI[];
}


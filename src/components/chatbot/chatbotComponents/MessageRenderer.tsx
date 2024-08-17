import React from "react";

import { useChatbot } from "../../../providers/chatbotProvider";
import { SmallText } from "../../Typography";
import { Icon } from "../../Icons";

export function MessageRenderer() {
  const {
    chatbot: { chatView },
  } = useChatbot();
  return (
    <div className="flex flex-col p-2 gap-3">
      {chatView?.chats?.map((each) => {
        return (
          <div key={each?.message?.id} className="flex flex-col gap-2">
            <div
              className={`flex group transition-all duration-300 text-purple-800 items-start gap-1.5 relative ${
                each?.user?.is_bot ? "justify-start" : "justify-end"
              }`}
            >
              {each?.user?.is_bot ? (
                <img
                  alt={each?.user?.name}
                  src={each?.user.profileImage}
                  className="h-8 w-8 mt-1.5 rounded-lg"
                />
              ) : (
                <div className="group-hover:flex hidden  text-gray-500 flex-col justify-center mt-1.5 items-center gap-0.5">
                  <Icon
                    icon="trash-2"
                    className="!h-5 !w-5 hover:text-red-600 hover:bg-red-100 p-1 rounded-md cursor-pointer"
                  />
                  <Icon
                    icon="edit-2"
                    className="!h-5 !w-5 hover:text-blue-600 hover:bg-blue-100 p-1 rounded-md cursor-pointer"
                  />
                </div>
              )}

              <SmallText className="p-2 px-4 bg-purple-50 max-w-[74%] rounded-md">
                {" "}
                {each?.message?.value} jsijsoidjoiads asjd sajd asd jsaid ajoids
                joiads oisad
              </SmallText>
              {!each?.user?.is_bot ? (
                <img
                  alt={each?.user?.name}
                  src={each?.user.profileImage}
                  className="h-8 w-8 mt-1.5 rounded-lg"
                />
              ) : null}
            </div>
            {each?.actions?.length ? (
              <div className="flex  items-center gap-2 flex-wrap max-w-[75%]">
                {each?.actions?.map((each) => {
                  return (
                    <button
                      className="border p-2 px-4 text-xs rounded-2xl text-purple-700 border-purple-600 bg-purple-50"
                      key={each?.label}
                    >
                      {each?.label}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

import React, { useState } from "react";

import { SmallText } from "../../Typography";
import { Icon } from "../../Icons";
import { ChatActionI, ChatI } from "../../../types/chatbot.types";
import { CircularLoader } from "../../loaders";
import { useChatbot } from "../../../providers/chatbotProvider";
interface MessageRendererPropsI {
  onSelectAction: (chat: ChatI, action: ChatActionI) => Promise<void>;
  chats: ChatI[];
  onDeleteAction: (chat: ChatI) => Promise<void>;
  editItem: string;
  onCancelEdit: () => void;
  onEditValue: React.Dispatch<
    React.SetStateAction<{
      messageId: string;
      value: string;
    }>
  >;
}
export function MessageRenderer(props: MessageRendererPropsI) {
  const { actionsDisable } = useChatbot();
  const [loadingAction, setLoadingAction] = useState("");
  return (
    <div className="flex flex-col  gap-4 h-full w-full">
      {props?.chats?.map((each) => {
        return (
          <div key={each?.message?.id} className="flex flex-col gap-2">
            <div
              className={`flex group transition-all duration-300 pb-2 text-purple-800 items-start gap-1.5 relative ${
                each?.from_user?.is_bot ? "justify-start" : "justify-end"
              }`}
            >
              {each?.from_user?.is_bot ? (
                <div
                  className={`h-8 w-8 mt-1.5 ${
                    each?.isLoading ? "flex items-center justify-center" : ""
                  } rounded-lg relative`}
                >
                  <img
                    alt={each?.from_user?.name}
                    src={each?.from_user?.profile_image}
                    className={`${
                      each?.isLoading ? "opacity-0" : ""
                    } h-full w-full rounded-lg  object-contain`}
                  />
                  <CircularLoader
                    className={`text-purple-800 absolute !h-4 !w-4 ${
                      each?.isLoading ? "block" : "hidden"
                    }`}
                  />
                </div>
              ) : each?.isLoading ? null : (
                <div
                  className={`${
                    props?.editItem === each?.message?.id
                      ? "flex"
                      : "group-hover:flex hidden"
                  }   flex-wrap text-gray-500  justify-center mt-auto mb-2 items-center  gap-0.5`}
                >
                  {!props?.editItem ? (
                    <Icon
                      icon="trash-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        props?.onDeleteAction(each);
                      }}
                      className="!h-5 !w-5 hover:text-red-600 hover:bg-red-100 p-1 rounded-md cursor-pointer"
                    />
                  ) : null}

                  {each?.message?.action_id ||
                  (props?.editItem &&
                    props?.editItem !==
                      each?.message?.id) ? null : props?.editItem ===
                    each?.message?.id ? (
                    <Icon
                      icon="x"
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onCancelEdit();
                      }}
                      className="!h-5 !w-5 hover:text-blue-600 hover:bg-blue-100 p-1 rounded-md cursor-pointer"
                    />
                  ) : (
                    <Icon
                      icon="edit-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onEditValue({
                          messageId: each?.message?.id,
                          value: each?.message?.value,
                        });
                      }}
                      className="!h-5 !w-5 hover:text-blue-600 hover:bg-blue-100 p-1 rounded-md cursor-pointer"
                    />
                  )}
                </div>
              )}

              <SmallText className="p-2 px-4 bg-purple-50 max-w-[70%] rounded-md">
                {" "}
                {each?.message?.value}
              </SmallText>
              {!each?.from_user?.is_bot ? (
                <div
                  className={`h-8 w-8 mt-1.5 ${
                    each?.isLoading ? "flex items-center justify-center" : ""
                  }  relative`}
                >
                  <img
                    alt={each?.from_user?.name}
                    src={each?.from_user.profile_image}
                    className={`${
                      each?.isLoading ? "opacity-0" : ""
                    } h-full w-full rounded-lg object-contain`}
                  />
                  <CircularLoader
                    className={`text-purple-800 absolute !h-4 !w-4 ${
                      each?.isLoading ? "block" : "hidden"
                    }`}
                  />
                </div>
              ) : null}
            </div>
            {each?.actions?.length ? (
              <div className="flex  items-center gap-2 pb-2 flex-wrap max-w-[75%]">
                {each?.actions?.map((eachAction) => {
                  return (
                    <button
                      disabled={
                        actionsDisable ||
                        loadingAction === eachAction?.action_id
                      }
                      onClick={async (e) => {
                        e.stopPropagation();
                        setLoadingAction(eachAction?.action_id);
                        await props?.onSelectAction(each, eachAction);
                        setLoadingAction("");
                      }}
                      className="border p-2 px-4 text-xs flex items-center justify-center relative rounded-3xl text-purple-700 border-purple-600 bg-purple-50"
                      key={eachAction?.action_id}
                    >
                      <CircularLoader
                        className={`absolute ${
                          loadingAction === eachAction?.action_id
                            ? "block"
                            : "hidden"
                        } !h-4 !w-4 text-purple-800`}
                      />
                      <SmallText
                        className={`${
                          loadingAction === eachAction?.action_id
                            ? "opacity-0"
                            : ""
                        }`}
                      >
                        {eachAction?.value}
                      </SmallText>
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

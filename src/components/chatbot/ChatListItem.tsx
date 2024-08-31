import React, { useMemo } from "react";

import tw from "tailwind-styled-components";
import { ChatI } from "../../types/chatbot.types";
import { ExtraSmallText, SmallText } from "../Typography";
import { getLastSeen } from "../../../utils";
import { ChatbotSvg } from "./chatbotComponents";
import { Icon } from "../Icons";
import { ChatBotDetailsI } from "../../providers/chatbotProvider";

type ListItemPropT = {
  chat: ChatI;
  onRouteToChatview: (chat: ChatI) => void;
  chatBotDetails: ChatBotDetailsI;
};

function ListItem({ chat, onRouteToChatview, chatBotDetails }: ListItemPropT) {
  const getUserDetails = useMemo(() => {
    return chatBotDetails?.userDetails?.user_id === chat?.from_user
      ? chatBotDetails?.userDetails || {}
      : chatBotDetails?.botDetails || {};
  }, [chat?.from_user, chatBotDetails]);
  return (
    <ListContainer
      onClick={() => {
        onRouteToChatview(chat);
      }}
    >
      {getUserDetails?.profile_image ? (
        <img
          className="rounded-full h-10 object-contain w-10"
          alt="Artisan"
          src={getUserDetails?.profile_image}
        />
      ) : (
        <ChatbotSvg className="rounded-full !h-10 !w-10" />
      )}

      <MessageContainer>
        <SmallText
          className={`truncate font-semibold  w-full text-start group-hover:text-purple-600`}
        >
          {chat?.message?.value}
        </SmallText>
        <MessageMetadataContainer>
          <ExtraSmallText>{getUserDetails?.name}</ExtraSmallText>
          <SecondaryIndicator />
          <ExtraSmallText>{getLastSeen(chat?.updated_at)}</ExtraSmallText>
        </MessageMetadataContainer>
      </MessageContainer>

      <div className="w-6 inline-flex group-hover:text-purple-600 justify-center">
        <Icon icon="chevron-right" />
      </div>
    </ListContainer>
  );
}

export default ListItem;

const ListContainer = tw.div`group  transition-all duration-200  cursor-pointer flex items-center gap-3 py-6 px-3`;
const MessageContainer = tw.div`inline-flex flex-1 truncate items-start sm:max-w-[78%] w-[79%] flex-col overflow-clip gap-1`;
const SecondaryIndicator = tw.div`h-1.5 w-1.5 rounded-full bg-gray-300`;

const MessageMetadataContainer = tw.div`inline-flex overflow-clip text-gray-600 items-center gap-2`;

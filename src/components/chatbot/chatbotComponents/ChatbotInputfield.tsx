import  { useCallback, useEffect, useRef, useState } from "react";
import { LANG } from "../../../constants";
import { Icon } from "../../Icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChatI } from "@/types/chatbot.types";
import { ExtraSmallText } from "@/components/Typography";
import { useChatbot } from "@/providers/chatbotProvider";

type ChatbotInputfieldPropsT = {
  disabled?: boolean;
  onEnter: (value: string) => void;
  inpValue: string;
  inputChangeWatcher: number;
};
interface SettingsComponentPropsI {
  context: ChatI["context"];
}
const SettingsComponent = (props: SettingsComponentPropsI) => {
  return (
    <div className=" h-full gap-2 p-1 overflow-y-hidden hide-scroll overflow-x-auto flex items-center  w-full  bg-gray-100">
      <ExtraSmallText className="font-medium">Context :</ExtraSmallText>
      <Select value={props?.context}>
        <SelectTrigger className="w-[110px]">
          <SelectValue placeholder="Context" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ONBOARDING" className="text-black">
            <ExtraSmallText>Onboarding</ExtraSmallText>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export const ChatbotInputfield = (props: ChatbotInputfieldPropsT) => {
  const { onEnter, disabled, inpValue, inputChangeWatcher } = props;
  const { chatView } = useChatbot();

  const inputElementRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const clearAll = () => {
    setValue("");
  };

  useEffect(() => {
    setValue(inpValue || "");
  }, [inputChangeWatcher]);

  const onSubmit = useCallback(() => {
    const trimmedValue = value?.trim();
    if (!disabled && trimmedValue) {
      onEnter(trimmedValue);
      clearAll();
    }
  }, [value, disabled, onEnter]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        onSubmit();
      }
    };

    if (inputElementRef?.current) {
      inputElementRef.current.focus();
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputElementRef, onSubmit, showSettings]);

  return (
    <div
      className={`h-[4rem] transition-all duration-300 sm:h-[3.5rem] px-4 sm:rounded-b-lg group border-t flex items-center overflow-hidden bg-gray-50 w-full ${
        disabled ? "cursor-not-allowed" : ""
      }`}
    >
      <div className="flex-1 relative overflow-hidden h-full">
        <div
          className={`absolute inset-0 flex items-center transition-transform duration-300 ${
            showSettings ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <input
            id="submit"
            disabled={disabled}
            onChange={(e) => setValue(e.target.value)}
            placeholder={LANG.CHATBOT.ASK_A_QUESTION}
            ref={inputElementRef}
            autoComplete="new-password"
            value={value}
            className={`w-full h-full text-sm bg-transparent outline-none border-0 ring-0 ${
              disabled ? "cursor-not-allowed" : ""
            }`}
          />
          {value && (
            <Icon
              icon="send"
              className="hover:text-purple-500 text-gray-600 !h-5 !w-5 cursor-pointer ml-2"
              onClick={onSubmit}
            />
          )}
        </div>
        <div
          className={`absolute inset-0 transition-transform h-full flex-1 duration-300 ${
            showSettings ? "translate-x-0" : "translate-x-[300px]"
          }`}
        >
          <SettingsComponent context={chatView?.context} />
        </div>
      </div>
      <Icon
        icon={showSettings ? "x" : "settings"}
        className="!h-4 !w-4 text-gray-600 cursor-pointer ml-2"
        onClick={() => setShowSettings((prev) => !prev)}
      />
    </div>
  );
};

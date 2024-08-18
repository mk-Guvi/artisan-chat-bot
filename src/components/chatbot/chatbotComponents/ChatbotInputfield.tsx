import { useCallback, useEffect, useRef, useState } from "react";
import { LANG } from "../../../constants";
import { Icon } from "../../Icons";

type ChatbotInputfieldPropsT = {
  disabled?: boolean;
  onEnter: (value: string) => void;
  inpValue?: string;
};
export const ChatbotInputfield = (props: ChatbotInputfieldPropsT) => {
  const { onEnter, disabled, inpValue } = props;
  const inputElementRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState("");

  const clearAll = () => {
    setValue("");
  };

  useEffect(() => {
    setValue(inpValue || "");
  }, [inpValue]);

  const onSubmit = useCallback(() => {
    const trimmedValue = value?.trim();
    if (!disabled && trimmedValue) {
      onEnter(trimmedValue);
      clearAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, disabled]);

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

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      if (inputElementRef) {
        window.removeEventListener("keydown", handleKeyDown);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputElementRef, onSubmit]);

  return (
    <div
      className={`h-[4rem] sm:h-[3.5rem] items-center px-4 sm:rounded-b-lg group border-t flex gap-2 bg-gray-50 w-full ${
        disabled ? "cursor-not-allowed" : ""
      }`}
    >
      <input
        id={"submit"}
        disabled={disabled}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        placeholder={LANG.CHATBOT.ASK_A_QUESTION}
        ref={inputElementRef}
        autoComplete={"new-password"}
        value={value || ""}
        className={`flex-1 h-full bg-transparent outline-none border-0  ring-0 ${
          disabled ? "cursor-not-allowed" : ""
        }`}
      />
      {value ? (
        <Icon
          icon="send"
          className="text-purple-500 cursor-pointer"
          onClick={onSubmit}
        />
      ) : null}
    </div>
  );
};

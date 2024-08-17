import React from "react";

type PropsT = { className?: string };

export function ChatbotSvg({ className = "" }: PropsT) {
  return (
    <svg
      className={`${className} h-6 w-6`}
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <rect width="150" height="150" fill="url(#pattern0_1_16)" />
      <defs>
        <pattern
          id="pattern0_1_16"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_1_16" transform="scale(0.00666667)" />
        </pattern>
        <image
          id="image0_1_16"
          width="150"
          height="150"
          xlinkHref="data:image/jpeg;base64,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"
        />
      </defs>
    </svg>
  );
}

export const MessageSvg = () => {
  return (
    <svg width="33" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.333 2.667a2.5 2.5 0 012.5 2.5v23.778c0 1.335-1.613 2.005-2.558 1.063L21.245 24H5.667a2.5 2.5 0 01-2.5-2.5V5.167a2.5 2.5 0 012.5-2.5h21.666z"
        fill="#000"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23 9.667a1 1 0 010 2H9.667a1 1 0 110-2H23zm-6 6.666a1 1 0 110 2h-6.667a1 1 0 010-2H17z"
        fill="#fff"
      ></path>
    </svg>
  );
};

export const GifSvg = () => {
  return (
    <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.223 3.3H14a.7.7 0 01.7.7v8a.7.7 0 01-.7.7H4.223a.7.7 0 01-.7-.7h-1.3a2 2 0 002 2H14a2 2 0 002-2V4a2 2 0 00-2-2H4.223a2 2 0 00-2 2h1.3a.7.7 0 01.7-.7z"
        fill="#757575"
      ></path>
      <path
        d="M5.658 7.1a1.883 1.883 0 00-.172-.671 1.735 1.735 0 00-.418-.57 1.95 1.95 0 00-.672-.399 2.697 2.697 0 00-.922-.144c-.507 0-.937.103-1.289.308-.351.206-.618.491-.8.856-.183.362-.274.781-.274 1.258v.64c0 .35.046.673.137.973.094.297.237.557.43.781.192.221.437.395.734.52s.65.187 1.059.187c.382 0 .712-.053.988-.16.279-.11.506-.257.683-.441.18-.188.313-.4.399-.637.086-.24.129-.49.129-.75V7.81H3.53v.903h.929v.234a.844.844 0 01-.106.415.78.78 0 01-.32.308 1.116 1.116 0 01-.539.117c-.263 0-.475-.06-.637-.183a1.066 1.066 0 01-.347-.508 2.305 2.305 0 01-.106-.723V7.75c0-.44.091-.78.274-1.02.182-.241.444-.363.785-.363.135 0 .256.019.363.055a.863.863 0 01.48.39.91.91 0 01.102.29h1.25zm2.328 3.642V5.409H6.701v5.333h1.285zm2.524 0V8.73h2.058v-1H10.51V6.44h2.265V5.41h-3.55v5.332h1.285z"
        fill="#757575"
      ></path>
    </svg>
  );
};

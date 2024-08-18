export const searchValue = (value: string, compareValue: string) => {
  return compareValue?.toLowerCase()?.includes(value?.toLowerCase());
};

/**
 * It takes a string, removes all non-alphanumeric characters, replaces spaces with underscores, and
 * converts the result to lowercase
 * @param {string} value - The string to be converted to an id.
 * @returns A string with all non-alphanumeric characters removed and spaces replaced with underscores.
 */
export const generateId = (value: string, allowedString?: string) => {
  return value
    .replace(new RegExp(`[^a-z0-9_\\s${allowedString || ""}]`, "gi"), "")
    .replace(/\s/g, "_")
    .toLowerCase();
};

export const isValidEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export function generateBaseUrl() {
  const protocol = window.location.protocol; // e.g., "http:" or "https:"
  const host = window.location.host; // e.g., "www.example.com" (hostname and port)

  return `${protocol}//${host}`;
}

export function suspenseDelay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

type makeIdPropsType = {
  prefixText?: string;
  onlyNumber?: boolean;
  onlySmallerCase?: boolean;
  length?: number;
};

export function makeId(props: makeIdPropsType) {
  const { prefixText, onlyNumber, length = 10, onlySmallerCase } = props;
  let text = prefixText ? `${prefixText}` : "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  if (onlySmallerCase) {
    possible = "abcdefghijklmnopqrstuvwxyz";
  }
  if (onlyNumber) possible = "1234567890";
  for (let i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

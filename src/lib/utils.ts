import ms from "ms";

export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return "never";
  return `${ms(Date.now() - new Date(timestamp).getTime())}${
    timeOnly ? "" : " ago"
  }`;
};

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const json = await res.json();
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number;
      };
      error.status = res.status;
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }

  return res.json();
}

export function nFormatter(num: number, digits?: number) {
  if (!num) return "0";
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
    : "0";
}

export function capitalize(str: string) {
  if (!str || typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const truncate = (str: string, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
};

import { stripeFeesFixed, stripeFeesPercentage } from "./constants";

export const calculateStripeFee = (pGaol: number) => {
  if (pGaol <= 0) return { total: 0, stripeFee: 0 };
  const pCharge = (pGaol + stripeFeesFixed) / (1 - stripeFeesPercentage);
  const stripeFee = parseFloat((pCharge - pGaol).toFixed(2));

  return { total: pCharge.toFixed(2), stripeFee: stripeFee };
};

export const urlEncodePath = (path: string) => {
  return encodeURI(
    path
      .trim()
      .replace(/,?\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase()
  );
};

export const processRichText = (text: string): string => {
  //replace bold text
  var outText = text.replaceAll("\n**", "\n<b>").replaceAll("**\n", "</b>\n");
  return outText;
  //handle italics

  //handle internal links
};

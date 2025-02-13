import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FormatCurrencyOptions {
  currency: string;
  locale?: string;
  value: number;
}

export const formatter = {
  format: (input: number | FormatCurrencyOptions): string => {
    if (typeof input === "number") {
      // If only a number is passed, default to USD and en-US
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(input);
    }

    const { value, currency, locale } = input;
    try {
      return new Intl.NumberFormat(locale || getDefaultLocale(), {
        style: "currency",
        currency: currency.toUpperCase(),
      }).format(value);
    } catch (error) {
      return `${currency.toUpperCase()} ${value.toFixed(2)}`;
    }
  },

  formatMultiple: (value: number) => {
    return {
      USD: formatter.format({ value, currency: "USD", locale: "en-US" }),
      INR: formatter.format({ value, currency: "INR", locale: "hi-IN" }),
      JPY: formatter.format({ value, currency: "JPY", locale: "ja-JP" }),
      RUB: formatter.format({ value, currency: "RUB", locale: "ru-RU" }),
      EUR: formatter.format({ value, currency: "EUR", locale: "de-DE" }),
      GBP: formatter.format({ value, currency: "GBP", locale: "en-GB" }),
      AUD: formatter.format({ value, currency: "AUD", locale: "en-AU" }),
      CAD: formatter.format({ value, currency: "CAD", locale: "en-CA" }),
    };
  },
};
function getDefaultLocale(): string | string[] | undefined {
  throw new Error("Function not implemented.");
}


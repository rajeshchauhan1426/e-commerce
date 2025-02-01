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
  format: ({ value, currency, locale }: FormatCurrencyOptions): string => {
    try {
      return new Intl.NumberFormat(locale || getDefaultLocale(), {
        style: "currency",
        currency: currency.toUpperCase(),
      }).format(value);
    } catch (error) {
      // Fallback for invalid currencies or unsupported locales
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
      CAD: formatter.format({ value, currency: "CAD", locale: "en-CA" })
    };
  },
};

function getDefaultLocale(): string {
  if (typeof navigator !== "undefined") {
    return navigator.language || "en-US";
  }
  return "en-US"; // Default for server-side or unsupported environments
}

// Example usage:
// formatter.format({ value: 1234.56, currency: 'EUR' }) // uses browser locale
// formatter.format({ value: 1234.56, currency: 'JPY', locale: 'ja-JP' })
// formatter.formatMultiple(1234.56) // Returns multiple currency formats
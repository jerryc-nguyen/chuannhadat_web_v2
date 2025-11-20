import { type ClassValue, clsx } from 'clsx';
import { formatDistanceToNowStrict } from 'date-fns';
import { FormatDistanceToken, vi } from 'date-fns/locale';
import { ReadonlyURLSearchParams } from 'next/navigation';
import queryString from 'query-string';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { ONE_BILLION } from './constants';

/**
 * Check if a value is blank (undefined, null, or empty string).
 */
export function isBlank(value: unknown): value is undefined | null | "" {
  return value === undefined || value === null || value === "";
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function concatStrings(...string: string[]) {
  return string.join('');
}

const customViLocale = {
  ...vi,
  formatDistance: (token: FormatDistanceToken, count: number) => {
    const customTranslations = {
      lessThanXSeconds: 'Vừa xong',
      xSeconds: 'Vừa xong',
      halfAMinute: 'Vừa xong',
      lessThanXMinutes: 'Vừa xong',
      xMinutes: `${count} phút trước`,
      aboutXHours: '1 giờ trước',
      xHours: `${count} giờ trước`,
      xDays: `${count} ngày trước`,
      aboutXWeeks: `${count} tuần trước`,
      xWeeks: `${count} tuần trước`,
      aboutXMonths: `${count} tháng trước`,
      xMonths: `${count} tháng trước`,
      aboutXYears: `${count} năm trước`,
      xYears: `${count} năm trước`,
      overXYears: `${count} năm trước`,
      almostXYears: `${count} năm trước`,
    };

    return customTranslations[token];
  },
};
/**
 * Formats a given date to a relative time string (e.g., "2 days ago").
 *
 * @param {Date} date - The date to be formatted.
 * @returns {string} - A string representing the relative time from the given date to now,
 *                     with a suffix (e.g., "ago") in Vietnamese locale.
 */
export const formatRelativeTime = (date: Date | string) => {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: customViLocale,
  });
};

export function stringToSlug(str?: string) {
  str = str ?? '';

  const from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ';
  const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy';
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(RegExp(from[i], 'gi'), to[i]);
  }

  str = str
    .toLowerCase()
    .trim()
    // eslint-disable-next-line no-useless-escape
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-');

  return str;
}

export const removeEmpty = (obj: Record<A, A>) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== '' && v !== null && v !== undefined),
  );

export const removeNull = (obj: Record<A, A>) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v));
export const genKey = (index: number) => index;

export const toastSucess = (content: string, description?: string) => {
  toast.success(content, {
    description,
    classNames: {
      toast: '!bg-[#ecfdf3] !border-[#d3fde5] !text-[#008a2e]',
    },
  });
};

export const generateRandomString = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
export const getInitialsName = (fullName: string) => {
  const words = (fullName || '').trim().split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  const initials = words[0][0] + words[1][0];
  return initials.toUpperCase();
};
export const truncateText = (text: string, maxLength = 100) => {
  if (text?.length > maxLength) {
    return `${text?.substring(0, maxLength)} .....`;
  }
  return text;
};
export const objectToQueryParams = (obj: Record<string, A>, parentKey = ''): string => {
  const queryString = Object.keys(obj)
    .filter((key) => !!obj[key])
    .map((key) => {
      const value = obj[key];
      const fullKey = parentKey ? `${parentKey}[${key}]` : key;

      if (Array.isArray(value)) {
        return value
          .map((item, index) =>
            typeof item === 'object'
              ? objectToQueryParams(item, `${fullKey}[${index}]`)
              : `${encodeURIComponent(fullKey)}[${index}]=${encodeURIComponent(item)}`,
          )
          .join('&');
      }
      if (typeof value === 'object' && value !== null && 'value' in value) {
        // Special handling for objects with a "value" field
        return `${encodeURIComponent(key)}=${encodeURIComponent(value.value)}`;
      }
      if (typeof value === 'object' && value !== null) {
        return objectToQueryParams(value, fullKey);
      }
      return `${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`;
    })
    .join('&');

  return queryString;
};
export const queryParamsToObject = (query: string): Record<string, A> => {
  const result: Record<string, A> = {};

  query
    .substring(1)
    .split('&')
    .forEach((param) => {
      const [encodedKey, encodedValue] = param.split('=');
      const key = decodeURIComponent(encodedKey);
      const value = decodeURIComponent(encodedValue);

      const keys = key
        .replace(/\]/g, '')
        .split(/\[|\]/)
        .filter((k) => k);

      keys.reduce((acc, currKey, index) => {
        if (index === keys.length - 1) {
          acc[currKey] = value;
        } else {
          acc[currKey] = acc[currKey] || (Number.isNaN(Number(keys[index + 1])) ? {} : []);
        }
        return acc[currKey];
      }, result);
    });

  return result;
};

export const timeAgo = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  const intervals = [
    { label: 'năm', seconds: 31536000 },
    { label: 'tháng', seconds: 2592000 },
    { label: 'ngày', seconds: 86400 },
    { label: 'giờ', seconds: 3600 },
    { label: 'phút', seconds: 60 },
    { label: 'giây', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diff / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label} trước`;
    }
  }
  return 'Vừa xong';
};

export const objectToQueryString = (
  obj: Record<string, A>
) => {
  return queryString.stringify(removeEmpty(obj), {
    skipNull: true,
    skipEmptyString: true,
  });
};

export const searchParamsToObj = (searchParams?: ReadonlyURLSearchParams | null) => {
  return queryString.parse(searchParams?.toString() ?? '') as Record<A, A>;
};
export const formatPriceFilterChip = (price: number, hasUnit = true) => {
  const isLowerBillion = price < ONE_BILLION;
  const formatNumber = (value: number): string => {
    const isWhole = value % 1 === 0;
    return isWhole ? value.toString() : value.toFixed(1);
  };
  if (isLowerBillion) {
    const millionValue = price / 1_000_000;
    return hasUnit ? `${formatNumber(millionValue)} triệu` : formatNumber(millionValue);
  }
  const billionValue = price / ONE_BILLION;
  return hasUnit ? `${formatNumber(billionValue)} tỷ` : formatNumber(billionValue);
};
export const formatRangeText = (min: number, max: number) => {
  const isSameLowerBillion = min < ONE_BILLION && max < ONE_BILLION;
  const isSameHigherBillion = min >= ONE_BILLION && max >= ONE_BILLION;
  if (isSameLowerBillion) {
    return `${formatPriceFilterChip(min, false)}-${formatPriceFilterChip(max, false)} triệu`;
  }
  if (isSameHigherBillion) {
    return `${formatPriceFilterChip(min, false)}-${formatPriceFilterChip(max, false)} tỷ`;
  }
  return `${formatPriceFilterChip(min, true)}-${formatPriceFilterChip(max, true)}`;
};
export const formatAreaText = (min?: number, max?: number) => `${min ?? 0}-${max ?? 0} m2`;

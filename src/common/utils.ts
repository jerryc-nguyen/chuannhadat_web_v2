import { type ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function concatStrings(...string: string[]) {
  return string.join('');
}

export function stringToSlug(str?: string) {
  str = str ?? '';

  const from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ',
    to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy';
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
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== ''));

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
  const words = fullName.trim().split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  const initials = words[0][0] + words[1][0];
  return initials.toUpperCase();
};
export const truncateText = (text: string, maxLength = 100) => {
  if (text?.length > maxLength) {
    return text?.substring(0, maxLength) + ' .....';
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
      } else if (typeof value === 'object' && value !== null && 'value' in value) {
        // Special handling for objects with a "value" field
        return `${encodeURIComponent(key)}=${encodeURIComponent(value.value)}`;
      } else if (typeof value === 'object' && value !== null) {
        return objectToQueryParams(value, fullKey);
      } else {
        return `${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`;
      }
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
          acc[currKey] = acc[currKey] || (isNaN(Number(keys[index + 1])) ? {} : []);
        }
        return acc[currKey];
      }, result);
    });

  return result;
};

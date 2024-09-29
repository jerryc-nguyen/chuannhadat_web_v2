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

export const removeEmpty = (obj: Record<A, A>) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== ''));

export const removeNull = (obj: Record<A, A>) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v));
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
export const truncateText = (text: string, maxLength: number = 100) => {
  if (text?.length > maxLength) {
    return text?.substring(0, maxLength) + ' .....';
  }
  return text;
};

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stringToSlug(str?: string) {
  str = str ?? '';

  const from =
      'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ',
    to =
      'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy';
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
    Object.entries(obj).filter(([, v]) => v !== ''),
  );

export const removeNull = (obj: Record<A, A>) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v),
  );

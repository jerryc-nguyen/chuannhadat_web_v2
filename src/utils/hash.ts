export const removeEmpty = (obj: Record<any, any>) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== '')
  );

export const removeNull = (obj: Record<any, any>) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v));

export const uniq = <T extends any[]>(arr: T): T => {
  return [...new Set(arr)] as T;
};

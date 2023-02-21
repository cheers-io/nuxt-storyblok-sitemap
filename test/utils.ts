export const getAbsoluteUrl = (
  baseUrl: string,
  path: string,
  lang: string = ""
) => {
  return lang.length ? `${baseUrl}/${lang}/${path}` : `${baseUrl}/${path}`;
};

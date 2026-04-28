import slugify from "slugify";

export const convertTextToSlug = (name: string) => {
  const result = slugify(name, { lower: true, strict: true });
  return result;
};

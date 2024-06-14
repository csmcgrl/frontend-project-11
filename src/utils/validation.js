import * as yup from 'yup';

export default (urlHistory, url) => {
  const schema = yup.string().url().notOneOf(urlHistory);
  return schema.validate(url).catch((err) => err);
};

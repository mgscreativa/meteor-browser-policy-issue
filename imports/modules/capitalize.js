/* eslint-disable consistent-return */

const capitalizeFirstWords = string => (
  string.charAt(0).toUpperCase() + string.slice(1)
);

const capitalizeAll = string => (
  string.toUpperCase()
);

export { capitalizeFirstWords, capitalizeAll };

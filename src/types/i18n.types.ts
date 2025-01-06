export type IntlParams = {
  locale: string;
};

export type IntlPageParams<T = void> = {
  params: IntlParams & T;
};

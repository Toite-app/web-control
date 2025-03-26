type FormatPriceOptions = {
  groupNumbers?: boolean;
  alwaysShowDecimals?: boolean;
};

export default function formatPrice(
  price: string | number,
  opts?: FormatPriceOptions
) {
  const integer = Math.floor(Number(price));
  const decimal = Math.round(Number(price) * 100) % 100;

  // Format integer with grouped numbers if option is enabled
  let formattedInteger = integer.toString();
  if (opts?.groupNumbers) {
    formattedInteger = integer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  if (decimal === 0 && !opts?.alwaysShowDecimals) {
    return formattedInteger;
  }

  if (decimal < 10) {
    return `${formattedInteger}.0${decimal}`;
  }

  return `${formattedInteger}.${decimal}`;
}

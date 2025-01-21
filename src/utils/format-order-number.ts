export default function formatOrderNumber(value: string) {
  if (Number.isNaN(Number(value))) {
    return value;
  }

  const valueAsNumber = Number(value);

  if (valueAsNumber % 1 !== 0) value = valueAsNumber.toFixed(2);
  else value = valueAsNumber.toString();

  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return `№${value}`;
}

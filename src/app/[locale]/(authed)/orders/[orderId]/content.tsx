type Props = {
  orderId: string;
};

export default function OrderPageContent({ orderId }: Props) {
  return <div>{orderId}</div>;
}

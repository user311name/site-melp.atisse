import PaymentReturnStatus from "./PaymentReturnStatus";

export default async function PaymentReturnPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;
  return <PaymentReturnStatus sessionId={sessionId ?? ""}/>;
}

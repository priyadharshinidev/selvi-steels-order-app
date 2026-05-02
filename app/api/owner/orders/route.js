import { listOrders } from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const orders = await listOrders();
  return Response.json({ orders });
}

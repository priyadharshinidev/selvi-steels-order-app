import { createOrder } from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await request.json();
  const order = await createOrder(body);

  return Response.json({ order }, { status: 201 });
}

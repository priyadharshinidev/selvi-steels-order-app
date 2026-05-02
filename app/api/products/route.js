import { listProducts } from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await listProducts();
  return Response.json(
    { products },
    { headers: { "Cache-Control": "no-store" } }
  );
}

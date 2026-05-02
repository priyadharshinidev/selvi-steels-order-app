import { deleteProduct, listProducts, saveProduct } from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await listProducts();
  return Response.json(
    { products },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request) {
  const product = await request.json();
  const savedProduct = await saveProduct(product);

  return Response.json({ product: savedProduct }, { status: 201 });
}

export async function PUT(request) {
  const product = await request.json();
  const savedProduct = await saveProduct(product);

  return Response.json({ product: savedProduct });
}

export async function DELETE(request) {
  const body = await request.json();
  await deleteProduct(Number(body.id));

  return Response.json({ ok: true });
}

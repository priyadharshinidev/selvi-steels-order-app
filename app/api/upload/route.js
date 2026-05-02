import { put } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return Response.json({ message: "Image file is required." }, { status: 400 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      {
        message:
          "BLOB_READ_WRITE_TOKEN is not configured. Add Vercel Blob storage before deploying image uploads."
      },
      { status: 500 }
    );
  }

  const extension = file.name?.split(".").pop() || "jpg";
  const filename = `products/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: false
  });

  return Response.json({ url: blob.url });
}

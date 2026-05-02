import { findUserByLogin } from "@/lib/repository";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const body = await request.json();
  const name = body.name?.trim();
  const phone = body.phone?.trim();

  const user = await findUserByLogin(name, phone);

  if (!user) {
    return Response.json(
      { message: "Name and phone number do not match existing records." },
      { status: 401 }
    );
  }

  return Response.json({
    user
  });
}

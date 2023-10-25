import { NextRequest } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  const secret = request.nextUrl.searchParams.get("secret");
  const tag = request.nextUrl.searchParams.get("tag");

  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ message: "Invalid secret" }, { status: 401 });
  }
  if (!tag && !path)
    return Response.json(
      { message: "Missing path or tag param" },
      { status: 400 }
    );

  if (tag) revalidateTag(tag);
  if (path) revalidatePath(path);

  return Response.json({ revalidated: true, now: Date.now() });
}

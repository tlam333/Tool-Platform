const apiURL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllTools(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "3";
  const keyword = searchParams["keyword"] ?? "";
  const location = searchParams["location"] ?? "";
  const offset = searchParams["offset"] ?? "";
  const categories = searchParams["categories"] ?? "";
  const payloadUrl = `${apiURL}/tools?page=${page}&limit=${limit}&keyword=${keyword}&location=${location}&offset=${offset}&categories=${categories}`;

  const res = await fetch(`${payloadUrl}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 },
    //cache: "no-store",
  });
  if (!res.ok) {
    return undefined;
  }

  return await res.json();
}

export async function getToolById(id: string) {
  const res = await fetch(`${apiURL}/tools/${id}`, { next: { tags: [id] } });
  if (!res.ok) {
    return undefined;
  }

  return res.json();
}

export async function createTool(formData: Tool) {
  const res = await fetch(`${apiURL}/tools`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!res.ok) {
    return undefined;
  }

  return res.json();
}

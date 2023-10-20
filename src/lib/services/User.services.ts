const apiURL = process.env.NEXT_PUBLIC_API_URL;

export async function createUser(formData: User) {
  const res = await fetch(`${apiURL}/users`, {
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

export async function getUser(id: string) {
  const res = await fetch(`${apiURL}/users/${id}`);
  if (!res.ok) {
    return undefined;
  }

  return res.json();
}

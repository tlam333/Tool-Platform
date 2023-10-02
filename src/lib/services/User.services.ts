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

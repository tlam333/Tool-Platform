const apiURL = process.env.NEXT_PUBLIC_API_URL;

export async function createBookingRequest(booking: Booking) {
  const res = await fetch(`${apiURL}/booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(booking),
  });
  if (!res.ok) {
    return undefined;
  }

  return res.json();
}

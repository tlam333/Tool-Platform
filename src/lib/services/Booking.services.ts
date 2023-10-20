const apiURL = process.env.NEXT_PUBLIC_API_URL;

export async function createBookingRequest(booking: Booking) {
  const res = await fetch(`${apiURL}/bookings`, {
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

export async function getBookingById(id: string) {
  const res = await fetch(`${apiURL}/bookings/${id}`, { cache: "no-store" });
  if (!res.ok) {
    return undefined;
  }

  return res.json();
}

export async function updateBookingStatus(data: any) {
  const res = await fetch(`${apiURL}/bookings/${data.bookingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    return undefined;
  }

  return res.json();
}

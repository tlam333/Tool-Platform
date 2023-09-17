const apiURL = process.env.AIRTABLE_API_URL;
const baseId = process.env.BASE_ID;
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  var url = `${apiURL}/${baseId}/Bookings`;

  const {
    firstName,
    lastName,
    email,
    phone,
    suburb,
    postCode,
    toolId,
    ownerId,
    startDate,
    endDate,
    comments,
  } = await request.json();

  //create the renter user
  const renter = await fetch(`${apiURL}/${baseId}/Users`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
    body: JSON.stringify({
      performUpsert: {
        fieldsToMergeOn: ["Email"],
      },
      records: [
        {
          fields: {
            "First Name": firstName,
            "Last Name": lastName,
            Email: email,
            Phone: phone,
            City: suburb,
            "Post Code": postCode.toString(),
          },
        },
      ],
    }),
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));

  const renterId = renter.records[0].id;

  //then create the booking
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            toolId: [toolId],
            ownerId: [ownerId],
            renterId: [renterId],
            startDate: startDate,
            endDate: endDate,
            Comments: comments,
          },
        },
      ],
      typecast: true,
    }),
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));

  const records = await res.records;
  //console.log(records);

  return NextResponse.json(records);
}

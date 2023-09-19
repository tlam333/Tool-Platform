const apiURL = process.env.AIRTABLE_API_URL;
const baseId = process.env.BASE_ID;
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

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
    toolName,
    ownerId,
    startDate,
    endDate,
    comments,
    toolLocation,
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

  /** Send email using sendgrid */
  /**
   * parameters -
   * email
   * firstName
   * fullName
   * city tool located in
   * Template ID: d-80a6f09b8373499c8ef58d5dfa0d5c1d (booking request sent)
   */
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  // Define the dynamic variables
  const dynamicTemplateData = {
    first_name: firstName,
    full_name: firstName + " " + lastName,
    city: toolLocation,
    tool_name: toolName,
  };
  const templateId = "d-80a6f09b8373499c8ef58d5dfa0d5c1d";

  // Create the email message
  const msg = {
    to: [{ email: email, name: firstName + " " + lastName }],
    from: { email: "will@nearbytools.com.au", name: "Will @ Nearby Tools" },
    templateId,
    dynamic_template_data: dynamicTemplateData,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
  /** send email ends here */

  return NextResponse.json(records);
}

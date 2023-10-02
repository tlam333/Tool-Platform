import { NextRequest, NextResponse } from "next/server";
const apiURL = process.env.AIRTABLE_API_URL;
const baseId = process.env.BASE_ID;
import sgMail from "@sendgrid/mail";

var url = `${apiURL}/${baseId}/Users`;

/**create user*/
export async function POST(request: NextRequest, response: NextResponse) {
  const {
    firstName,
    lastName,
    email,
    phone,
    suburb,
    state,
    postCode,
  }: Partial<User> = await request.json();
  var message = "User created successfully.";
  const res = await fetch(url, {
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
            Email: email,
            "First Name": firstName,
            "Last Name": lastName,
            Phone: phone,
            City: suburb,
            State: state,
            "Post Code": postCode,
          },
        },
      ],
    }),
  })
    .then((response) => response.json())
    .catch((err) => {
      console.error(err);
      message = err;
    });

  /** Send welcome email using sendgrid */
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
  // Define the dynamic variables
  const dynamicTemplateData = {
    first_name: firstName,
  };
  const templateId = "d-8d2515b3043a47b0a320af82e8419895";

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
      console.log("Welcome Email sent");
    })
    .catch((error) => {
      console.error(error);
    });

  return NextResponse.json({
    message: message,
    id: res.records[0].id,
  });
}

import { NextRequest, NextResponse } from "next/server";
const apiURL = process.env.AIRTABLE_API_URL;
const baseId = process.env.BASE_ID;
import sgMail from "@sendgrid/mail";

var url = `${apiURL}/${baseId}/Users`;

/**create user*/
export async function POST(request: NextRequest, response: NextResponse) {
  const {
    id,
    address,
    firstName,
    lastName,
    email,
    phone,
    suburb,
    state,
    postCode,
    interest,
    image,
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
            "Street Address": address,
            City: suburb,
            State: state,
            "Post Code": postCode,
            Interest: interest,
            image: image,
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

  if (!id) {
    /** Send welcome email using sendgrid */
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    // Define the dynamic variables
    const dynamicTemplateData = {
      first_name: firstName,
    };
    const templateId = "d-8d2515b3043a47b0a320af82e8419895";

    // Create the email message
    const msg = {
      to: [
        {
          email: email || "nagendra@nearbytools.com.au",
          name: firstName + " " + lastName,
        },
      ],
      from: { email: "will@nearbytools.com.au", name: "Will @ Nearby Tools" },
      templateId,
      dynamic_template_data: dynamicTemplateData,
    };
    if (email) {
      sgMail
        .send(msg)
        .then(() => {
          console.log("Welcome Email sent");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  return NextResponse.json({
    message: message,
    id: res.records[0].id,
  });
}

/**get users*/
export async function GET(request: NextRequest, response: NextResponse) {
  const { searchParams } = new URL(request.url);
  const userIds = searchParams.get("userIds") || undefined;
  const email = searchParams.get("email") || undefined;

  const res = await getUsers(userIds, email);

  const { error } = await res;
  if (error) {
    console.log("get user error-", error);
    return NextResponse.json({ error: error });
  }

  const { users } = await res;

  return NextResponse.json({ users: users });
}

async function getUsers(userIds?: string, email?: string) {
  if (!userIds && !email) {
    return { error: "No user ids or emails provided." };
  }
  const fieldList = ["Email", "First+Name", "Last+Name", "Phone", "City"];
  const encodedFields = fieldList.map((field) => "&fields[]=" + field);

  var url1 = encodeURI(`${url}?${encodedFields.join("")}`);

  if (email) {
    url1 = `${url1}&filterByFormula=SEARCH(%22${email}%22%2C+Email)`;
  } else if (userIds) {
    url1 = `${url1}&filterByFormula=SEARCH(RECORD_ID()%2C+%22${userIds}%22)`;
  }

  const res = await fetch(url1, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));
  const { error } = await res;
  if (error) {
    console.log("get user error-", error);
    return { error: error };
  }
  const users = await res.records;
  return { users: users };
}

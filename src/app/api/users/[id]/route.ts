import { NextRequest, NextResponse } from "next/server";
const apiURL = process.env.AIRTABLE_API_URL;
const baseId = process.env.BASE_ID;

var url = `${apiURL}/${baseId}/Users`;

export async function GET(request: NextRequest, context: any) {
  const id = context.params.id;

  const resp = await getUserDetails(id);

  const { error } = await resp;

  const { user } = await resp;

  return NextResponse.json({ user: user });
}

export async function getUserDetails(id: string) {
  const res = await fetch(`${url}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => {
      console.error(err);
    });

  if (res === "NOT_FOUND") return { error: "NOT_FOUND" };

  const user = {
    id: res.id,
    firstName: res.fields["First Name"],
    lastName: res.fields["Last Name"],
    email: res.fields["Email"],
    phone: res.fields["Phone"],
    address: res.fields["Street Address"],
    suburb: res.fields["City"],
    postCode: res.fields["Post Code"],
    state: res.fields["State"],
    country: "AU",
    interest: res.fields["Interest"],
    stripeId: res.fields["stripeId"],
    createdAt: res.fields["CreatedAt"],
    updatedAt: res.fields["UpdatedAt"],
  };

  return { user: user };
}

export async function PATCH(request: NextRequest, context: any) {
  const id = context.params.id;

  const { ...userData }: Partial<User> = await request.json();

  const res = updateUser(id, userData);
  const { message, updatedId } = await res;

  return NextResponse.json({ message: message, id: updatedId });
}

export async function updateUser(
  id: string,
  {
    firstName,
    lastName,
    email,
    phone,
    address,
    suburb,
    state,
    postCode,
    country,
    interest,
    stripeId,
  }: Partial<User>
) {
  var message = "User updated successfully.";
  var updatedId = undefined;
  const res = await fetch(`${url}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
    body: JSON.stringify({
      fields: {
        Email: email,
        "First Name": firstName,
        "Last Name": lastName,
        Phone: phone,
        "Street Address": address,
        City: suburb,
        "Post Code": postCode,
        State: state,
        Country: country,
        Interest: interest,
        stripeId: stripeId,
      },
    }),
  })
    .then((response) => response.json())
    .catch((err) => {
      console.error(err);
    });
  const { error } = await res;
  if (error) {
    message = error;
    console.log("update user error-", error);
  } else {
    updatedId = await res.id;
  }

  return { message, updatedId };
}

import { sendEmail } from "../notifications/email/route";
export async function sendOtp(email: string, token: string) {
  const templateId = "d-e25d37d411ab432ea392200bb2880027";
  const response = await sendEmail(email, "", { token: token }, templateId);
  const { error } = response;
  if (error) {
    throw new Error(JSON.stringify(error));
  }
  return true;
}

var airtableApiUrl = `${process.env.AIRTABLE_API_URL}/${process.env.BASE_ID}`;

export async function saveOtp(email: string, token: string, expiryTime: Date) {
  var message = "otp saved!";
  const res = await fetch(`${airtableApiUrl}/otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
    body: JSON.stringify({
      fields: {
        otp: token,
        email: email,
        expiryTime: expiryTime,
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
  }

  //check if user exists or new user
  const res1 = await fetch(
    `${airtableApiUrl}/Users?&filterByFormula=SEARCH(%22${email}%22%2C+Email)`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      },
      cache: "no-store",
    }
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));

  const { error: error1 } = await res1;
  if (error1) {
    console.log(`error while checking new user flas for - ${email}-`, error1);
    return { error: error1 };
  }

  const { records: users } = await res1;

  if (users && users.length > 0) {
    return { newUser: false };
  } else {
    return { newUser: true };
  }
}

export async function getOtp(email: string, token: string) {
  const res = await fetch(
    `${airtableApiUrl}/otp?&filterByFormula=AND(SEARCH(%22${email}%22%2C+email),SEARCH(%22${token}%22%2C+otp))`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      },
      cache: "no-store",
    }
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));

  const { error } = await res;
  if (error) {
    console.log(`error while fetching otp for ${email}-`, error);
    return { error: error };
  }

  const { records } = await res;

  //implement delete these records

  if (records && records.length > 0) {
    return {
      otpRow: {
        email: records[0].fields.email,
        otp: records[0].fields.otp,
        expiryTime: records[0].fields.expiryTime,
        id: records[0].id,
      },
    };
  } else {
    return { error: "Invalid OTP!" };
  }
}

export async function deleteOtp(id: string) {
  const res = await fetch(`${airtableApiUrl}/otp/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
  });
}

export async function createUser(user: Partial<User>) {
  const response = await fetch(`${airtableApiUrl}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
    }),
  });
  const { id, message } = await response.json();

  return { userId: id };
}

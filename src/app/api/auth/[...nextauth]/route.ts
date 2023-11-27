import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUsers } from "../../users/route";
import { NextRequest, NextResponse } from "next/server";
import { createUser, deleteOtp, getOtp, saveOtp } from "../../users/util";
import { sendEmail } from "../../notifications/email/route";
const tokenExpiry = 10 * 60; // 10 minutes
const pages = {
  signIn: "/auth/signin",
  //   signOut: "/auth/signout",
  //   error: "/auth/error", // Error code passed in query string as ?error=
  //   verifyRequest: "/auth/verify-request", // (used for check email message)
  //   newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
};
var newUser: boolean = false;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID as string,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    // }),
    CredentialsProvider({
      id: "otp-generation",
      type: "credentials",
      name: "Magic Code",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Your email address",
        },
      },
      async authorize() {
        return null;
      },
    }),
    CredentialsProvider({
      id: "otp-verification",
      type: "credentials",
      name: "Magic Code",
      credentials: {
        email: { label: "Email", type: "text" },
        code: {
          label: "Code",
          type: "text",
          placeholder: "Enter the code you received via email",
        },
        firstName: { label: "First name", type: "text" },
        lastName: { label: "Last name", type: "text" },
        interest: { label: "interest", type: "text" },
      },
      async authorize(credentials, _req) {
        const email = credentials?.email.trim();
        const code = credentials?.code.trim();

        if (email === undefined || code === undefined) {
          return null;
        }
        const { status, error } = await validateOtp(email, code);

        if (!status) {
          throw new Error(JSON.stringify(error));
        }

        if (newUser) {
          //create new user in db
          const { userId } = await createUser({
            email: email || "",
            firstName: credentials?.firstName,
            lastName: credentials?.lastName,
            interest: credentials?.interest,
          });

          return {
            id: userId,
            name: credentials?.firstName + " " + credentials?.lastName,
            email: email,
          };
        } else {
          //get user from db
          const response = await getUsers(undefined, email as string);
          const { users } = response;
          const user = {
            id: users[0].id,
            email: users[0].fields["Email"],
            name:
              users[0].fields["First Name"] +
              " " +
              users[0].fields["Last Name"],
            image: users[0].fields["image"],
          };
          if (users.length > 0) {
            return user;
          } else {
            return null; //or error
          }
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.complete = token.complete as boolean;
      }
      return session;
    },
    async jwt({ token, account, user, trigger }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.id = user.id;
        token.complete = false;
      }
      if (trigger === "update") {
        token.complete = true;
      }
      return token;
    },

    async signIn({ profile, user }) {
      try {
        //find or create the user in the database
        const response = await getUsers(undefined, user.email as string);
        const { users } = response;

        if (users.length === 0) {
          const firstName = user.name?.split(" ")[0];

          const lastName = user.name?.split(" ").slice(1).join(" ");
          const { userId } = await createUser({
            email: user.email || "",
            firstName: firstName,
            lastName: lastName,
            image: user.image || "",
          });
          user.id = userId;
        } else {
          user.id = users[0].id;
        }
        return true;
      } catch (e) {
        console.log(e);
        // Return false to display a default error message
        return false;
      }
    },
  },
  session: { strategy: "jwt" },
  pages: pages,
};

const handler = async (req: NextRequest, res: NextResponse) => {
  const nextauth = req.nextUrl.pathname.replace("/api/auth/", "").split("/");
  if (
    nextauth !== undefined &&
    nextauth.length > 1 &&
    nextauth[0] === "callback" &&
    nextauth[1] === "otp-generation" &&
    req.method === "POST"
  ) {
    const email = req.nextUrl.searchParams.get("email")?.trim() || "";

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Provide valid email." },
        { status: 500 }
      );
    }
    const { newUser } = await sendOtp(email);

    res = NextResponse.json({ newUser: newUser }, { status: 201 });
    res.cookies.set("otp-flow.new-user", newUser ? "yes" : "no", {
      httpOnly: true,
      maxAge: tokenExpiry,
      path: "/",
    });

    return res;
  }

  newUser = req.cookies.get("otp-flow.new-user")?.value == "yes" ? true : false;

  return NextAuth(authOptions)(req, res);
};

export { handler as GET, handler as POST };

async function isValidEmail(email: string) {
  return true;
}

async function sendOtp(email: string) {
  //generate OTP
  const random = crypto.getRandomValues(new Uint8Array(8));
  const token = Buffer.from(random).toString("hex").slice(0, 6).toUpperCase();
  //send OTP uncomment below lines
  const templateId = "d-e25d37d411ab432ea392200bb2880027";
  const response = await sendEmail(email, "", { otp: token }, templateId);
  const { error } = response;
  if (error) {
    throw new Error(JSON.stringify(error));
  }
  //save OTP
  var expiryTime = new Date();
  expiryTime.setSeconds(expiryTime.getSeconds() + tokenExpiry);
  const newUser = await saveOtp(email, token, expiryTime);
  return newUser;
}

async function validateOtp(email: string, token: string) {
  const { error, otpRow } = await getOtp(email, token);
  var currentTime = new Date();
  currentTime.setSeconds(currentTime.getSeconds() + 1);
  var otpStatus = false;
  var errorMessage = undefined;
  if (error) {
    errorMessage = error;
  } else {
    if (otpRow?.email == email && otpRow?.otp == token) {
      if (new Date(otpRow.expiryTime) >= currentTime) {
        otpStatus = true;
      } else {
        //otp expired - delete otp
        deleteOtp(otpRow.id);
        errorMessage = "OTP expired!";
      }
    } else errorMessage = "Invalid OTP!";
  }

  if (errorMessage) return { status: false, error: errorMessage };
  else {
    // OTP validated, delete the record from otp table
    deleteOtp(otpRow?.id);
  }

  return { status: true, error: errorMessage };
}

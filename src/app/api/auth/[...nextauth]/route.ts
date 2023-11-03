import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
const apiURL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     email: { label: "Email", type: "text" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials, req) {
    //     if (typeof credentials !== "undefined") {
    //       const res = await authenticate(
    //         credentials.email,
    //         credentials.password
    //       );
    //       if (typeof res !== "undefined") {
    //         return { ...res.user, apiToken: res.token };
    //       } else {
    //         return null;
    //       }
    //     } else {
    //       return null;
    //     }
    //   },
    // }),
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
        const response = await fetch(`${apiURL}/users?email=${user.email}`);
        const { users } = await response.json();

        if (users.length === 0) {
          const firstName = user.name?.split(" ")[0];

          const lastName = user.name?.split(" ").slice(1).join(" ");
          //create the user
          const response = await fetch(`${apiURL}/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              email: user.email,
              firstName: firstName,
              lastName: lastName,
              image: user.image,
            }),
          });
          const { userId, message } = await response.json();
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

  // pages: {
  //   signIn: "/auth/signin",
  //   signOut: "/auth/signout",
  //   error: "/auth/error", // Error code passed in query string as ?error=
  //   verifyRequest: "/auth/verify-request", // (used for check email message)
  //   newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  // },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's ID from DB. */
      id: string;
      /** if user details is complete */
      complete: boolean;
    } & DefaultSession["user"];
  }
}

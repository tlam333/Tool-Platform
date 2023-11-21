import { getSession } from "next-auth/react";
import SignInComponent from "@/components/user/forms/SignIn";

export default async function SigninPage(context: any) {
  const { req } = context;
  const session = await getSession({ req });
  const isLoggedIn = session !== null;

  return <SignInComponent></SignInComponent>;
}

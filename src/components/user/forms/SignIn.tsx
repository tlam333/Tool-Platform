"use client";
import { signIn } from "next-auth/react";
import { Google, Facebook, LoadingDots } from "@/components/shared/icons";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Input from "@/components/tools/forms/Input";
import EmailSignin from "./EmailSignin";
import Balancer from "react-wrap-balancer";
interface Props {
  redirect?: string;
}

export default function SignInComponent({ redirect }: Props) {
  const [signInClickedGm, setSignInClickedGm] = useState(false);
  const [signInClickedFb, setSignInClickedFb] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  if (session && redirect) {
    router.push(redirect);
  } else if (session?.user) {
    return (
      <div className="w-full overflow-hidden md:max-w-md">
        <p>You are already signed in!</p>
      </div>
    );
  }
  return (
    <>
      <div className="w-full overflow-hidden md:max-w-md md:rounded-2xl md:border md:border-gray-200">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
          <a href="https://nearbytools.com.au">
            <Image
              src="/icon.png"
              alt="Logo"
              className="h-10 w-10"
              width={20}
              height={20}
            />
          </a>
          <h3 className="font-display text-2xl font-bold">Sign In</h3>
          <p className="text-sm text-gray-500">Please sign in to continue.</p>
          <p>First time? We will create the account automatically for you.</p>
        </div>

        <div className="flex flex-col bg-gray-50 px-4 p-4 md:px-16">
          <EmailSignin
            buttonText="Sign In with email"
            redirect={redirect}
          ></EmailSignin>
        </div>

        <hr></hr>
        <div className="flex flex-col space-y-4 bg-gray-50 px-4 p-8 md:px-16">
          <button
            disabled={signInClickedGm}
            className={`${
              signInClickedGm
                ? "cursor-not-allowed border-gray-200 bg-gray-100"
                : "border border-gray-200 bg-white text-black hover:bg-gray-50"
            } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
            onClick={() => {
              setSignInClickedGm(true);
              signIn(
                "google",
                redirect ? { callbackUrl: redirect } : undefined
              );
            }}
          >
            {signInClickedGm ? (
              <LoadingDots color="#808080" />
            ) : (
              <>
                <Google className="h-5 w-5" />
                <p>Sign In with Google</p>
              </>
            )}
          </button>
        </div>
        {/* <div className="flex flex-col bg-gray-50 px-4 pb-4 md:px-16">
          <button
            disabled={signInClickedFb}
            className={`${
              signInClickedFb
                ? "cursor-not-allowed border-gray-200 bg-gray-100"
                : "border border-gray-200 bg-white text-black hover:bg-gray-50"
            } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
            onClick={() => {
              setSignInClickedFb(true);
              signIn(
                "facebook",
                redirect ? { callbackUrl: redirect } : undefined
              );
            }}
          >
            {signInClickedFb ? (
              <LoadingDots color="#808080" />
            ) : (
              <>
                <Facebook className="h-5 w-5" />
                <p>Sign In with Facebook</p>
              </>
            )}
          </button>
        </div> */}
        <div className="flex flex-col pb-6 px-4 md:px-16 bg-gray-50 mx-auto">
          <p className="text-sm">
            <Balancer>
              Creating an account means you agree to our{" "}
              <a href="/terms-of-use" target="_blank" className="link">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" className="link">
                Privacy Policy
              </a>
              .
            </Balancer>
          </p>
        </div>
      </div>
    </>
  );
}

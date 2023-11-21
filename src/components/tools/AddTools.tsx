"use client";
import UserForm from "./forms/UserForm";
import ToolForm from "./forms/ToolForm";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import SignInComponent from "./forms/SignIn";
import Balancer from "react-wrap-balancer";

export default function AddTools() {
  const [user, setUser] = useState<any>();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);

  return (
    <>
      {!user && (
        <>
          <h2 className="pt-5 text-center">Sign in to start listing tools!</h2>
          <p className="p-5 text-center">
            <Balancer>
              Simply sign in using one of the options below and start listing
              your tools & equipment.
            </Balancer>
          </p>
          <div className="mx-auto pb-5">
            <SignInComponent />
          </div>
        </>
      )}
      {user && !user.complete && (
        <>
          <h2 className="p-5 text-center">
            Please complete your details to start listing your tools!
          </h2>
          <UserForm buttonText={"Next-Add Tools"} />
        </>
      )}

      {user && user.complete && (
        <>
          <h2 className="p-5 text-center">
            Please provide tool or equipment details.
          </h2>
          <ToolForm buttonText={"Submit"} user={user.id} />
        </>
      )}
    </>
  );
}

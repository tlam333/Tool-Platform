"use client";
import UserForm from "./forms/UserForm";
import ToolForm from "./forms/ToolForm";
import { useState, useEffect } from "react";

export default function AddTools() {
  const [user, setUser] = useState<string>();
  useEffect(() => {
    const userId = window.localStorage.getItem("userId");
    if (userId) {
      setUser(JSON.parse(userId));
    }
  }, [user]);
  return (
    <>
      {!user && (
        <>
          <h2 className="p-5 text-center">
            Please fill your details to start listing your tools!
          </h2>
          <UserForm buttonText={"Next-Add Tools"} setUser={setUser} />
        </>
      )}

      {user && (
        <>
          <h2 className="p-5 text-center">
            Please provide tool or equipment details.
          </h2>
          <ToolForm buttonText={"Submit"} user={user} />
        </>
      )}
    </>
  );
}

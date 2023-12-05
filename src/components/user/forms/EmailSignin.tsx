"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { FieldError, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/components/tools/forms/Input";
import { useRouter } from "next/navigation";
import { LoadingDots } from "@/components/shared/icons";
import { gaEvent } from "@/lib/gtm";

interface Props {
  buttonText: string;
  redirect?: string;
  interest?: string;
}

export default function EmailSignin({ buttonText, redirect, interest }: Props) {
  const router = useRouter();
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [buttontxt, setButtontxt] = useState(
    buttonText || "Continue with Email"
  );

  const userSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    otp: Yup.string().length(6),
    firstName: Yup.string(),
    lastName: Yup.string(),
    interest: Yup.string(),
  });
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(userSchema),
    mode: "onChange",
    shouldUseNativeValidation: true,
  });

  const handleSignin = async (data: any) => {
    if (!verifyOtp) {
      const res = await fetch(
        `/api/auth/callback/otp-generation?email=${data.email}`,
        { method: "POST" }
      );
      const { newUser: isNewUser } = await res.json();
      setVerifyOtp(true);

      setNewUser(isNewUser);
      if (isNewUser) {
        setButtontxt("Sign Up");
      } else {
        setButtontxt("Sign In");
      }
    } else {
      if (data.otp.length !== 6) {
        setFormError("Please provid 6 digits otp sent to your email!");
        return;
      }
      if (newUser && (data.firstName.ength < 1 || data.lastName.length < 1)) {
        setFormError("Please complete all the required fields!");
        return;
      }
      await signIn("otp-verification", {
        email: data.email,
        code: data.otp,
        firstName: data.firstName,
        lastName: data.lastName,
        interest: data.interest,
        redirect: false,
      }).then(({ ok, error }: any) => {
        if (ok) {
          if (newUser)
            gaEvent({
              event: "sign_up",
              params: {
                method: "Email",
              },
            });
          else
            gaEvent({
              event: "login",
              params: {
                method: "Email",
              },
            });
          router.push(redirect || "");
        } else {
          setError(error);
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSignin)} name="signin_form">
      <div className="grid grid-cols-2 gap-2 max-w-xl mx-auto xl:px-0">
        <Input
          name="email"
          label="Email"
          divClassName="flex flex-col gap-1 col-span-2"
          register={register}
          required
          readonly={verifyOtp}
        />
        {verifyOtp && (
          <>
            {newUser && (
              <>
                <Input
                  name="firstName"
                  label="First name"
                  divClassName="flex flex-col gap-1 col-span-1"
                  register={register}
                  required
                />
                <Input
                  name="lastName"
                  label="Last name"
                  divClassName="flex flex-col gap-1 col-span-1"
                  register={register}
                  required
                />
              </>
            )}
            <Input
              name="otp"
              label="OTP"
              divClassName="flex flex-col gap-1 col-span-2"
              register={register}
              required
              placeholder="Enter the code you received via email"
              error={{ message: error } as FieldError}
            />
          </>
        )}
        <input type="hidden" {...register("interest")} value={interest} />

        {formError && <p className="text-sm text-red-500">{formError}</p>}
      </div>
      <div className="flex flex-col bg-gray-50">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`${
            isSubmitting
              ? "cursor-not-allowed border-gray-200 bg-gray-100"
              : "border border-gray-200 bg-white text-black hover:bg-gray-50"
          } flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
        >
          {isSubmitting ? (
            <LoadingDots color="#808080" />
          ) : (
            <>
              <p>{buttontxt}</p>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

"use client";
import { set, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Loading from "@/components/shared/Loading";
import Input from "@/components/tools/forms/Input";
import { createUser } from "@/lib/services/User.services";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/services/User.services";
import Balancer from "react-wrap-balancer";

interface Props {
  buttonText: string;
  setUser?: (user: string) => void;
  redirect?: string;
  interest?: string;
}
const userSchema = Yup.object().shape({
  id: Yup.string(),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone is required"),
  suburb: Yup.string().required("Suburb is required"),
  postCode: Yup.string()
    .matches(/^(0[289][0-9]{2})|([1-9][0-9]{3})$/, {
      message: "Invalid post code",
    })
    .required("Post code is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  interest: Yup.string(),
});
export default function UserForm({
  buttonText,
  setUser,
  redirect,
  interest = "List tools",
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isDirty },
    reset,
  } = useForm({
    resolver: yupResolver(userSchema),
    mode: "onChange",
    shouldUseNativeValidation: true,
    defaultValues: {
      country: "AU",
      state: "VIC",
      interest: interest,
    },
  });
  useEffect(() => {
    const userIdString = window.localStorage.getItem("userId");
    if (redirect && userIdString) {
      router.push(redirect);
    } else if (userIdString) {
      setLoading(true);
      const userId = JSON.parse(userIdString);
      getUser(userId).then((res) => {
        if (res?.error) {
          console.log(res.error);
        } else {
          reset({
            id: res.user.id,
            firstName: res.user.firstName,
            lastName: res.user.lastName,
            email: res.user.email,
            phone: res.user.phone,
            suburb: res.user.suburb,
            postCode: res.user.postCode,
            state: res.user.state,
            country: res.user.country,
            interest: interest,
          });
        }
        setLoading(false);
      });
    }
  }, []);

  async function onSubmit(data: any) {
    const res = await createUser(data).then((res) => {
      if (res.id) {
        window.localStorage.setItem("userId", JSON.stringify(res.id));
        if (setUser) setUser(res.id);
        if (redirect) {
          router.push(redirect);
        }
      }
    });
  }

  return (
    <>
      {loading && (
        <div className="text-center my-10">
          <Loading color="primary" />
          <br />
          <Balancer>
            <h2>Loading...</h2>
            <h2>Please wait!</h2>
            <br />
          </Balancer>
        </div>
      )}
      {!loading && (
        <form onSubmit={handleSubmit(onSubmit)} name="user_form">
          <div className="grid grid-cols-2 gap-2 max-w-xl mx-auto px-3 xl:px-0">
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
            <Input
              name="email"
              label="Email"
              divClassName="flex flex-col gap-1 col-span-2"
              register={register}
              required
            />
            <Input
              name="phone"
              label="Phone"
              divClassName="flex flex-col gap-1 col-span-2"
              register={register}
              required
            />
            <Input
              name="suburb"
              label="Suburb"
              divClassName="flex flex-col gap-1 col-span-1"
              register={register}
              required
            />
            <Input
              name="postCode"
              label="Post code"
              divClassName="flex flex-col gap-1 col-span-1"
              register={register}
              required
            />
            <input type="hidden" {...register("interest")} value={interest} />
            <input type="hidden" {...register("country")} value="AU" />
            <input type="hidden" {...register("state")} value="VIC" />
            <button
              type="submit"
              className="btn btn-primary mb-7 col-span-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loading /> : buttonText || "Submit"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}

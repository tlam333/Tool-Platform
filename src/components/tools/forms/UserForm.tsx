"use client";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Loading from "@/components/shared/Loading";
import Input from "@/components/tools/forms/Input";
import { createUser } from "@/lib/services/User.services";
import { useRouter } from "next/navigation";

interface Props {
  buttonText: string;
  setUser?: (user: string) => void;
  redirect?: string;
}
const userSchema = Yup.object().shape({
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
});
export default function UserForm({ buttonText, setUser, redirect }: Props) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(userSchema),
    mode: "onChange",
    shouldUseNativeValidation: true,
    defaultValues: {
      country: "AU",
      state: "VIC",
    },
  });

  async function onSubmit(data: any) {
    const res = await createUser(data).then((res) => {
      if (res.id) {
        window.localStorage.setItem("userId", JSON.stringify(res.id));
        if (setUser) setUser(res.id);
        if (redirect) {
          const router = useRouter();
          router.push(redirect);
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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

        <input type="hidden" {...register("country")} value="AU" />
        <input type="hidden" {...register("state")} value="VIC" />
        <button type="submit" className="btn btn-primary mb-7 col-span-2">
          {isSubmitting ? <Loading /> : buttonText || "Submit"}
        </button>
      </div>
    </form>
  );
}

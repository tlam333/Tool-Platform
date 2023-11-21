"use client";
import { useState, useEffect, use } from "react";
import UserForm from "../../user/forms/UserForm";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Loading from "@/components/shared/Loading";
import Input from "./Input";
import { createBookingRequest } from "@/lib/services/Booking.services";
import { useSearchParams } from "next/navigation";
import Balancer from "react-wrap-balancer";
import { CheckCircle, Frown } from "lucide-react";
import Link from "next/link";
import { calculateStripeFee } from "@/lib/utils";
import { useSession } from "next-auth/react";
import SignInComponent from "../../user/forms/SignIn";

interface Props {
  //@ts-ignore
  tool: Tool;
}
const today = new Date();
today.setHours(0, 0, 0, 0);

const bookSchema = Yup.object().shape({
  startDate: Yup.date()
    .default(today)
    .min(today, "Start date can't be in the past")
    .required()
    .typeError("Start date is required"),
  bookingDuration: Yup.number()
    .required()
    .typeError("Booking Duration is required")
    .min(1, "Minimum booking duration is 1"),
  comments: Yup.string(),
  toolId: Yup.string().required("Tool id is required"),
  toolName: Yup.string().required("Tool name is required"),
  ownerId: Yup.string().required("Owner id is required"),
  hirerId: Yup.string().required("Hirer id is required"),
});

export default function HireForm({ tool }: Props) {
  const [user, setUser] = useState<any>();
  const router = useSearchParams();
  // const checkoutSessionId = router.get("session_id");
  const { data: session } = useSession();

  const [errors, setErrors] = useState<any>();
  const [bookingCreated, setBookingCreated] = useState(false);
  const [checkoutSessionId, setCheckoutSessionId] = useState<string>(
    router.get("session_id") || ""
  );

  const { register, handleSubmit, formState, setValue, watch } = useForm({
    shouldUseNativeValidation: true,
    mode: "onChange",
    resolver: yupResolver(bookSchema),
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: true,
    },
    defaultValues: {
      //startDate: today,
      bookingDuration: 1,
    },
  });
  const { isSubmitting, isSubmitSuccessful } = formState;
  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
      setValue("hirerId", session.user.id);
    }
  }, [session]);

  const onSubmit = async (data: any) => {
    sessionStorage.setItem("bookingData", JSON.stringify(data));

    const res = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hirerId: session?.user.id }),
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));

    const { sessionUrl } = await res;

    window.location.assign(sessionUrl);
  };

  const handleCreateBooking = async (dataStr: any) => {
    const bookingData = JSON.parse(dataStr || "");

    bookingData.checkoutSessionId = checkoutSessionId;
    const res = await createBookingRequest(bookingData);
    const { error, bookingId } = await res;
    if (error) {
      setErrors(res.error);
    } else {
      setErrors(null);
      setBookingCreated(true);
    }
  };

  useEffect(() => {
    const bookingDataStr = sessionStorage.getItem("bookingData") || undefined;

    if (checkoutSessionId && checkoutSessionId !== "failed") {
      if (bookingDataStr) {
        sessionStorage.removeItem("bookingData");
        handleCreateBooking(bookingDataStr);
      } else {
        setBookingCreated(true);
      }
    }
  });

  const hireFee = tool.rent * watch("bookingDuration") || 0;

  const { stripeFee: cardFee, total: totalFee } = calculateStripeFee(
    hireFee + (tool.deposit || 0)
  );

  return (
    <>
      {!user && (
        <>
          <h2 className="pt-5 text-center">
            Sign in to continue with the booking!
          </h2>
          <div className="mx-auto pb-5">
            <SignInComponent />
          </div>
        </>
      )}
      {user && !user.complete && !checkoutSessionId && (
        <>
          <h2 className="py-2">Please confirm contact details.</h2>
          <hr className="my-2" />
          <UserForm buttonText={"Next-Select Dates"} />
        </>
      )}
      {user && user.complete && !checkoutSessionId && (
        <>
          <h2 className="py-2">
            Select date & duration for the hire and proceed to payment.
          </h2>
          <hr className="my-2" />
          <form
            onSubmit={handleSubmit(onSubmit)}
            name="booking_form"
            className="text-center"
          >
            <div className="grid grid-cols-2 gap-2">
              <input type="hidden" {...register("toolId")} value={tool.id} />
              <input
                type="hidden"
                {...register("toolName")}
                value={tool.name}
              />
              <input
                type="hidden"
                {...register("ownerId")}
                value={tool.owner}
              />

              <Input
                type="date"
                label="Start date"
                name="startDate"
                register={register}
                required
              />
              <Input
                type="number"
                label={`Duration in (${tool.duration.split(" ")[1]}s)`}
                name="bookingDuration"
                register={register}
                required
              />
              <Input
                divClassName="col-span-2 text-left"
                type="textarea"
                label="Comments"
                name="comments"
                register={register}
              />
            </div>
            <div className="card grid grid-cols-2 gap-2 text-left">
              <div className="col-span-1">
                <p>Hire rate ({tool.duration}):</p>
                <p>Hire fee:</p>
                <p>Deposit (refundable):</p>
                <p>Card processing fee:</p>
                <p className="font-bold">Total:</p>
              </div>
              <div className="col-span-1">
                <p>${tool.rent}</p>
                <p>${hireFee}</p>
                <p>${tool.deposit || 0}</p>
                <p>${cardFee}</p>
                <p className="font-bold">${totalFee}</p>
              </div>
              <br />
            </div>
            <p>
              Your card will not be charged until your request is approved by
              the owner.
            </p>
            <br />
            <button
              type="submit"
              className="btn btn-primary btn-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loading /> : "Pay & Book"}
            </button>
          </form>
        </>
      )}
      {checkoutSessionId && bookingCreated && (
        <div className="text-center my-10">
          <Balancer>
            <CheckCircle size="40" color="#08d4ab" />
          </Balancer>
          <h2>Hire request sent!</h2>
          <br />
          <p>The tool owner will contact you to confirm the booking.</p>
          <p>Your card will not be charged until your request is confirmed</p>
        </div>
      )}
      {checkoutSessionId &&
        checkoutSessionId !== "failed" &&
        !bookingCreated && (
          <div className="text-center my-10">
            <Loading color="primary" />
            <br />
            <Balancer>
              <h2>Please wait!</h2>
              <br />
            </Balancer>
          </div>
        )}
      {checkoutSessionId === "failed" && (
        <div className="text-center my-10">
          <Balancer>
            <Frown size="40" color="#f87272" />
          </Balancer>
          <h2>Payment process failed!</h2>
          <br />
          <p>We could not process your card or you cancelled the payment.</p>
          <p>Hire request is cancelled.</p>
          <br />
          <Link
            href={"?hirenow=true"}
            onClick={() => setCheckoutSessionId("")}
            className="btn btn-secondary"
          >
            Try Again
          </Link>
        </div>
      )}
      {errors && (
        <>
          <br />
          <p className="text-error">{errors?.type}</p>
          <p className="text-error">{errors?.message}</p>
        </>
      )}
    </>
  );
}

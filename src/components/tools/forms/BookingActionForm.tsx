"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "./Input";
import Loading from "@/components/shared/Loading";
import { updateBookingStatus } from "@/lib/services/Booking.services";
import Balancer from "react-wrap-balancer";
import { Frown, CheckCircle } from "lucide-react";

type props = {
  bookingId: string;
  bookingStatus: string;
  tool: Partial<Tool>;
};

export function BookingActionForm({ bookingId, bookingStatus, tool }: props) {
  const [status, setStatus] = useState<string>(bookingStatus);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useForm({
    shouldUseNativeValidation: true,
    mode: "onChange",
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: true,
    },
    defaultValues: {
      bookingId: bookingId,
      comments: "",
      status: "",
      toolName: tool.name,
      suburb: tool.location,
    },
  });

  const onSubmit = async (data: any) => {
    if (!isSubmitting) {
      await updateBookingStatus(data).then((res) => {
        if (res?.message) {
          setStatus(data.status);
        }
      });
    }
  };

  return (
    <>
      {status === "New" && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Your message to hirer</h2>
          <br />
          <Input
            type="textarea"
            name="comments"
            register={register}
            placeholder="Enter your message here"
            required={true}
          />
          <div className="flex flex-col md:flex-row justify-around my-10">
            <button
              type="submit"
              className="btn btn-primary btn-md"
              onClick={() => setValue("status", "Approved")}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loading /> : "Approve"}
            </button>

            <button
              type="submit"
              className="btn btn-error btn-md"
              onClick={() => setValue("status", "Rejected")}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loading /> : "Reject"}
            </button>
          </div>
        </form>
      )}
      {status == "Rejected" && (
        <div className="text-center my-10">
          <Balancer>
            <Frown size="40" color="#f87272" />
          </Balancer>
          <h2>You rejected the hire request!</h2>
          <br />
          <p>Please contact us if you changed your mind.</p>
          <br />
        </div>
      )}
      {status == "Approved" && (
        <div className="text-center my-10">
          <Balancer>
            <CheckCircle size="40" color="#08d4ab" />
          </Balancer>
          <h2>Booking request approved!</h2>
          <br />
          <p>You have successfully approved this request.</p>
          <p>Please contact hirer to coordinate pickup and drop off schedule</p>
        </div>
      )}
    </>
  );
}

"use client";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Loading from "@/components/shared/Loading";
import { createBookingRequest } from "@/lib/services/Booking.services";
import { CheckCircle } from "lucide-react";
import Balancer from "react-wrap-balancer";
import { useEffect, useState } from "react";

interface Props {
  tool: Tool;
}

function BookForm({ tool }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    suburb: Yup.string().required("Suburb is required"),
    postCode: Yup.number().required("Post code is required"),
    startDate: Yup.date()
      .default(today)
      .min(today, "Start date can't be in the past")
      .required("Start date is required"),
    endDate: Yup.date()
      .when("startDate", (startDate, schema) => {
        if (startDate) {
          const currentDay = new Date(
            new Date(startDate.toString()).getTime() + 60
          );
          //const nextDay = new Date(startDate.getTime() + 86400000);
          return schema.min(currentDay, "End date must be after start date");
        } else {
          return schema;
        }
      })
      .required("End date is required"),
    comments: Yup.string(),
    toolId: Yup.string().required("Tool id is required"),
    ownerId: Yup.string().required("Owner id is required"),
    toolName: Yup.string().required("Tool name is required"),
    toolLocation: Yup.string().required("Tool location is required"),
  });
  const { register, handleSubmit, formState, reset } = useForm({
    shouldUseNativeValidation: true,
    mode: "onChange",
    resolver: yupResolver(bookSchema),
    resetOptions: {
      keepDirtyValues: true, // user-interacted input will be retained
      keepErrors: true, // input errors will be retained with value update
    },
    defaultValues: {
      startDate: today,
    },
  });
  const { isSubmitting, isSubmitSuccessful } = formState;
  const [submitedStatus, setSubmitedStatus] = useState(false);

  const onSubmit = async (data: any) => {
    //data.preventDefault();
    const res = await createBookingRequest(data).then((res) => {
      if (res.error) {
        console.log(res.error);
      } else {
        console.log("Booking request sent!");
        setSubmitedStatus(true);
      }
      reset();
    });
  };

  return (
    <>
      <div className="mx-auto mt-2 gap-3 text-center">
        {!submitedStatus && (
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols2"> */}
            <div className="grid grid-cols-2 gap-2">
              <input type="hidden" {...register("toolId")} value={tool.id} />
              <input
                type="hidden"
                {...register("ownerId")}
                value={tool.owner}
              />
              <input
                type="hidden"
                {...register("toolName")}
                value={tool.name}
              />
              <input
                type="hidden"
                {...register("toolLocation")}
                value={tool.location}
              />
              <div className="col-span-1">
                <input
                  className="focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-3 leading-tight text-gray-700 shadow focus:outline-none"
                  placeholder="First name"
                  {...register("firstName")}
                />
              </div>
              <div className="col-span-1">
                <input
                  className="focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-3 leading-tight text-gray-700 shadow focus:outline-none"
                  placeholder="Last name"
                  {...register("lastName")}
                />
              </div>
              <div className="col-span-2">
                <input
                  className="focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-3 leading-tight text-gray-700 shadow focus:outline-none"
                  placeholder="Email"
                  {...register("email")}
                />
              </div>
              <div className="col-span-2">
                <input
                  className="focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-3 leading-tight text-gray-700 shadow focus:outline-none"
                  placeholder="Phone"
                  {...register("phone")}
                />
              </div>
              <div className="col-span-1">
                <input
                  className="focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-3 leading-tight text-gray-700 shadow focus:outline-none"
                  placeholder="Suburb"
                  {...register("suburb")}
                />
              </div>
              <div className="col-span-1">
                <input
                  className="focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-3 leading-tight text-gray-700 shadow focus:outline-none"
                  placeholder="Post code"
                  {...register("postCode")}
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="startDate">Start date</label>
                <input
                  type="date"
                  className="focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-3 leading-tight text-gray-700 shadow focus:outline-none"
                  {...register("startDate")}
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="endDate">End date</label>
                <input
                  type="date"
                  className="focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-3 leading-tight text-gray-700 shadow focus:outline-none"
                  {...register("endDate")}
                />
                {/* <div className="invalid-feedback">{errors.endDate?.message}</div> */}
              </div>
              <div className="col-span-2">
                <textarea
                  className="focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-3 leading-tight text-gray-700 shadow focus:outline-none"
                  placeholder="Message..."
                  {...register("comments")}
                />
              </div>
            </div>
            <button className="btn btn-primary">
              {isSubmitting ? <Loading /> : "Send request"}
            </button>
          </form>
        )}
        {submitedStatus && (
          <>
            <Balancer>
              <CheckCircle size="40" color="#06ffcc" />
            </Balancer>
            <h2>Booking request sent!</h2>
            <br />
            <p>The tool owner will contact you to confirm the booking.</p>
          </>
        )}
      </div>
    </>
  );
}

export default BookForm;

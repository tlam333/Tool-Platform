import { getBookingById } from "@/lib/services/Booking.services";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { BookingActionForm } from "@/components/tools/forms/BookingActionForm";

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const bookingResp = getBookingById(params.id);

  const { error, bookingData } = await bookingResp;
  if (error == "NOT_FOUND") {
    return notFound();
  }

  return (
    <div className="px-2 md:mt-10 lg:px-10 xl:px-20 w-full min-h-screen mx-auto max-w-6xl">
      <h1>Hire request details</h1>
      <div className="flex flex-col lg:flex-row justify-between my-10">
        <div>
          <h2 className="underline">Item details</h2>
          <div className="w-full my-2">
            <p className="text-lg">{bookingData.tool.name}</p>
            <p className="text-lg">Brand: {bookingData.tool.brand}</p>
            <p className="text-lg">
              Hire Rate - ${bookingData.tool.rent} {bookingData.tool.duration}
            </p>
            <p className="text-lg">
              Security Deposit - ${bookingData.tool.deposit || 0}
            </p>

            <div className="card-actions justify-between align-bottom">
              <div className="flex space-x-5 items-center">
                <p>
                  <MapPin color="#0078d4" />
                </p>
                <p className="text-lg">{bookingData.tool.location}</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="underline">Hirer details</h2>
          <div className="w-full my-2">
            <p className="text-lg">
              {bookingData.hirer.firstName + " " + bookingData.hirer.lastName}
            </p>
            <p className="text-lg">{bookingData.hirer.phone}</p>

            <div className="card-actions justify-between align-bottom">
              <div className="flex space-x-5 items-center">
                <p>
                  <MapPin color="#0078d4" />
                </p>
                <p className="text-lg">{bookingData.hirer.suburb}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-md">
          <h2 className="underline">Booking details</h2>
          <div className="w-full my-2">
            <p className="text-lg">
              Start date:{" "}
              {new Date(bookingData.booking.startDate).toLocaleDateString(
                "en-GB"
              )}
            </p>
            <p className="text-lg">
              Duration: {bookingData.booking.duration}{" "}
              {bookingData.tool.duration.split(" ")[1]}
            </p>

            <p className="text-lg">
              Total Hire Fee: ${bookingData.booking.hireFee || 0}
            </p>
            <p className="text-lg">
              Payment status:{" "}
              {bookingData.booking.paymentStatus || "Authorised"}
            </p>
            <p className="text-lg">
              Booking Status: {bookingData.booking.status || "New"}
            </p>
            <p className="text-lg">Comments: {bookingData.booking.comments}</p>
          </div>
        </div>
      </div>
      {bookingData.booking.status !== "New" && (
        <>
          <h2>Your message to hirer</h2>
          <br />
          <p>&quot;{bookingData.booking.ownerComments}&quot;</p>
        </>
      )}

      <BookingActionForm
        bookingId={bookingData.booking.id}
        bookingStatus={bookingData.booking.status}
        tool={bookingData.tool}
      />
    </div>
  );
}

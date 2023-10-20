import { NextRequest, NextResponse } from "next/server";
import { getToolData } from "../../tools/[toolId]/route";
import { getUserDetails } from "../../users/[id]/route";
import { sendEmail } from "../../notifications/email/route";
import { createCharge } from "../../payments/charge/route";

var airtableApiUrl = `${process.env.AIRTABLE_API_URL}/${process.env.BASE_ID}/Bookings`;

export async function GET(request: NextRequest, context: any) {
  const id = context.params.id;

  if (!id) {
    return NextResponse.json(
      { message: "Booking id is required" },
      { status: 400 }
    );
  }
  var bookingData: {
    tool?: Partial<Tool>;
    hirer?: Partial<User>;
    booking: Partial<Booking>;
  } = { booking: {} };
  const resp = getBookingData(id);

  const { error: errorBooking } = await resp;
  const { booking } = await resp;
  if (booking) {
    bookingData.booking = booking;
    const respTool = await getToolData(booking.toolId);
    const { error: errorTool } = await respTool;
    const { tool } = await respTool;
    if (tool) {
      bookingData.tool = tool;
    }
    const respHirer = await getUserDetails(booking.hirerId);
    const { error: errorHirer } = await respHirer;
    const { user: hirer } = await respHirer;
    if (hirer) {
      bookingData.hirer = hirer;
    }
  }

  return NextResponse.json({
    error: errorBooking,
    bookingData: bookingData,
  });
}

async function getBookingData(id: string) {
  const res = await fetch(airtableApiUrl + "/" + id, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));
  const { error } = await res;

  if (error) {
    return { error: error };
  }

  const record = await res;
  const booking = await {
    id: record.id,
    hirerId: record.fields["hirerId"],
    ownerId: record.fields["ownerId"],
    startDate: record.fields["startDate"],
    duration: record.fields["duration"],
    toolId: record.fields["toolId"],
    status: record.fields["status"],
    comments: record.fields["Comments"],
    hireFee: record.fields["hireFee"],
    invoiceAmount: record.fields["invoiceAmount"],
    holdAmount: record.fields["holdAmount"],
    paymentStatus: record.fields["paymentStatus"],
    ownerComments: record.fields["ownerComments"],
    paymentMethod: record.fields["paymentMethod"],
    paymentIntent: record.fields["paymentIntent"],
    paymentIntentDeposit: record.fields["paymentIntentDeposit"],
    createdAt: record.fields["createdAt"],
    updatedAt: record.fields["updatedAt"],
  };
  return { booking: booking };
}

export async function PUT(request: NextRequest, context: any) {
  const id = context.params.id;
  if (!id) {
    return NextResponse.json(
      { message: "Booking id is required" },
      { status: 400 }
    );
  }
  const { status, comments, userType, toolName, suburb } = await request.json();

  const resp = await updateBooking(id, {
    fields: {
      status: status,
      ownerComments: comments,
    },
  });

  const { error } = await resp;
  if (error) {
    return NextResponse.json({ error: error });
  }
  const { record } = await resp;
  /**notify renter*/
  const { user: hirer } = await getUserDetails(record.fields["hirerId"]);
  /** Send email using sendgrid to - Hirer */
  const templateIdHirer = "d-e32ab9e83f0b4c93a51a3e3faa4b0cad";
  const templateDataHirer = {
    first_name: hirer?.firstName,
    status: status,
    tool_name: toolName,
    city: suburb,
    comments: comments,
  };

  sendEmail(
    hirer?.email,
    hirer?.firstName + " " + hirer?.lastName,
    templateDataHirer,
    templateIdHirer
  );

  /** create a charge */

  if (status === "Approved") {
    const { booking } = await getBookingData(id);
    var updateFields: any = undefined;
    if (booking?.paymentStatus !== "succeeded") {
      const respCharge = await createCharge(
        booking?.hirerId,
        booking?.invoiceAmount,
        booking?.paymentMethod,
        true, //chargeNow
        "Hire fee for tool: " + toolName
      );
      const { paymentIntent, error } = respCharge;
      if (error) {
        console.log("payment error:", error);
      } else if (paymentIntent) {
        const { id: paymentInt, status } = paymentIntent;
        updateFields = {
          paymentIntent: paymentInt,
          paymentStatus: status,
        };
      }
    }
    if (!booking?.paymentIntentDeposit) {
      const respChargeDeposit = await createCharge(
        booking?.hirerId,
        booking?.holdAmount,
        booking?.paymentMethod,
        false, //chargeNow
        "Deposit for tool: " + toolName
      );
      const { paymentIntent, error } = respChargeDeposit;
      if (error) {
        console.log("security deposit payment error:", error);
      } else if (paymentIntent) {
        const { id: paymentInt, status } = paymentIntent;
        updateFields.paymentIntentDeposit = paymentInt;
      }
    }
    if (updateFields) {
      const updateBookingStatus = await updateBooking(id, {
        fields: updateFields,
      });
    }
  }

  return NextResponse.json({ message: "Booking status updated successfully" });
}

async function updateBooking(bookingId: string, data: any) {
  const resp = await fetch(airtableApiUrl + "/" + bookingId, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));

  const { error } = await resp;
  if (error) {
    return { error: error };
  }
  const record = await resp;
  return { record: record };
}

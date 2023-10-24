const apiURL = process.env.AIRTABLE_API_URL;
const baseId = process.env.BASE_ID;
import { NextResponse } from "next/server";

import { getUserDetails } from "../users/[id]/route";
import { getToolData } from "../tools/[toolId]/route";
import { sendEmail } from "../notifications/email/route";
import { calculateStripeFee } from "@/lib/utils";
import { getPaymentMethodFromSession } from "../payments/checkout/route";

export async function POST(request: Request) {
  var url = `${apiURL}/${baseId}/Bookings`;

  const {
    toolId,
    toolName,
    ownerId,
    hirerId,
    startDate,
    bookingDuration,
    comments,
    checkoutSessionId,
  } = await request.json();

  //get tool rent fee and security deposit
  const { tool } = await getToolData(toolId);
  //calculate fees
  const hireFee = (tool?.rent || 0) * bookingDuration;

  const { total: invoiceAmount, stripeFee: processingFee } =
    calculateStripeFee(hireFee);

  const { total: holdAmount } =
    (tool?.deposit || 0) > 0
      ? calculateStripeFee(tool?.deposit || 0)
      : { total: 0 };

  /** get payment method and payment intent */
  const { setupIntent, paymentMethod } = await getPaymentMethodFromSession(
    checkoutSessionId
  );

  //then create the booking
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            toolId: [toolId],
            ownerId: [ownerId],
            hirerId: [hirerId],
            startDate: startDate,
            duration: bookingDuration,
            Comments: comments,
            setupIntent: setupIntent,
            hireFee: hireFee,
            processingFee: processingFee,
            invoiceAmount: invoiceAmount,
            holdAmount: holdAmount,
            paymentStatus: "Authorised",
            paymentMethod: paymentMethod,
          },
        },
      ],
      typecast: true,
    }),
  })
    .then((response) => response.json())
    .catch((err) => console.error(err));

  const error = await res.error;
  if (error) {
    console.log("create booking error-", error);
    return NextResponse.json({ error: error });
  }
  const records = await res.records[0];

  const { user: hirer } = await getUserDetails(hirerId);
  const { user: owner } = await getUserDetails(ownerId);
  const startDateFormatted = new Date(startDate).toLocaleDateString("en-GB");

  /** Send email using sendgrid to - Hirer */
  const templateIdHirer = "d-80a6f09b8373499c8ef58d5dfa0d5c1d";
  const templateDataHirer = {
    first_name: hirer?.firstName,
    tool_name: toolName,
    city: owner?.suburb,
    start_date: startDateFormatted,
    duration: bookingDuration,
    comments: comments,
  };

  sendEmail(
    hirer?.email,
    hirer?.firstName + " " + hirer?.lastName,
    templateDataHirer,
    templateIdHirer
  );
  /* send email to owner */
  const templateIdOnwer = "d-5e234a6a6a83405eaef6f09414e8e9a3";
  const templateDataOwner = {
    first_name: owner?.firstName,
    tool_name: toolName,
    city: owner?.suburb,
    start_date: startDateFormatted,
    duration: bookingDuration,
    party_name: hirer?.firstName + " " + hirer?.lastName,
    phone: hirer?.phone,
    comments: comments,
    hire_fee: hireFee,
    hire_request_url: `${process.env.NEXT_PUBLIC_URL}/bookings/${records.id}`,
  };

  sendEmail(
    owner?.email,
    owner?.firstName + " " + owner?.lastName,
    templateDataOwner,
    templateIdOnwer
  );
  /** send email ends here */

  return NextResponse.json({ bookingId: records.id });
}

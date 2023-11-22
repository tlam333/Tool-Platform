import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { findOrCreateStripeCustomer } from "../stripeUser/util";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-08-16",
});

/**
 * stripe checkout api integration server side
 */
export async function POST(req: NextRequest) {
  const { userId, chargeAmout, paymentMethod, chargeNow, description } =
    await req.json();

  const resp = await createCharge(
    userId,
    chargeAmout,
    paymentMethod,
    chargeNow,
    description
  );
  const { paymentIntent, error } = await resp;
  return NextResponse.json({ paymentIntent: paymentIntent, error: error });
}

export async function createCharge(
  userId: string,
  chargeAmout: number,
  paymentMethod: string,
  chargeNow: boolean,
  description: string
) {
  if (chargeAmout <= 0) {
    return { error: "Charge amount must be greater than 0" };
  }

  const stripeCustomer = await findOrCreateStripeCustomer(userId);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: chargeAmout * 100, //convert in cents
    currency: "aud",
    description: description,
    automatic_payment_methods: { enabled: true },
    customer: stripeCustomer,
    payment_method: paymentMethod,
    confirm: chargeNow,
    off_session: chargeNow,
  });

  return { paymentIntent: paymentIntent };
}

export async function confirmCharg(paymentIntent: string) {
  const intent = await stripe.paymentIntents.confirm(paymentIntent);
  return { message: intent };
}

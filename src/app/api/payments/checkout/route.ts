import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { findOrCreateStripeCustomer } from "../stripeUser/util";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
/**
 * stripe checkout api integration server side
 */
const domainUrl = process.env.NEXT_PUBLIC_URL;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-08-16",
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    return NextResponse.json(
      { error: "Unauthenticated user!" },
      { status: 401 }
    );
  }
  const hirerId = session.user.id;

  const referer = req.headers.get("referer") || `${domainUrl}/success?`;

  const sessionUrl = await getCheckoutSessionUrl(hirerId, referer);

  return NextResponse.json({ sessionUrl: sessionUrl });
}

export async function getCheckoutSessionUrl(hirerId: string, baseUrl: string) {
  const stripeCustomer = await findOrCreateStripeCustomer(hirerId);

  const session = await stripe.checkout.sessions.create({
    mode: "setup",
    payment_method_types: ["card"],
    customer: stripeCustomer,
    success_url: `${baseUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}?session_id=failed`,
  });
  return session.url;
}

export async function getPaymentMethodFromSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const setupIntent = session.setup_intent;
  if (setupIntent) {
    const setupIntentObj = await stripe.setupIntents.retrieve(
      setupIntent.toString()
    );
    const paymentMethod = setupIntentObj.payment_method;
    return { setupIntent: setupIntent, paymentMethod: paymentMethod };
  }
  return { setupIntent: setupIntent, paymentMethod: undefined };
}

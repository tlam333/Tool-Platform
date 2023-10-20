import Stripe from "stripe";
import { getUserDetails, updateUser } from "../../users/[id]/route";
const apiURL = process.env.AIRTABLE_API_URL;
const baseId = process.env.BASE_ID;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-08-16",
});

export async function findOrCreateStripeCustomer(customerId: string) {
  const { user } = await getUserDetails(customerId);

  if (user?.stripeId) return user.stripeId;
  else {
    const customer = await stripe.customers.create({
      email: user?.email,
      name: user?.firstName + " " + user?.lastName,
    });

    await updateUser(customerId, { stripeId: customer.id });

    return customer.id;
  }
}

export async function createStripeCustomer(email: string) {
  const customer = await stripe.customers.create({
    email: email,
  });
  return customer;
}

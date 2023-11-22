import Balancer from "react-wrap-balancer";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hire successful",
};

export default function HireSuccessPage() {
  return (
    <>
      <div className="text-center my-10">
        <Balancer>
          <CheckCircle size="40" color="#08d4ab" />
        </Balancer>
        <h2>Hire request sent!</h2>
        <br />
        <p>The tool owner will contact you to confirm the booking.</p>
        <p>Your card will not be charged until your request is confirmed</p>
      </div>
      <div className="text-center my-10">
        <Link href="/for-hire" className="btn btn-primary">
          Explore other listings
        </Link>
        &nbsp;
        <Link href="/" className="btn btn-secondary">
          Home
        </Link>
      </div>
    </>
  );
}

import Balancer from "react-wrap-balancer";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
function ThankYou() {
  return (
    <>
      <div className="px-2 md:px-2 lg:px-10 xl:px-20 w-full bg-base-200 min-h-screen">
        <div className="mx-auto mb-10 mt-10 gap-3 text-center max-w-5xl py-5">
          <h1 className="py-10">
            <Balancer>Thank you!</Balancer>
          </h1>
          <Balancer>
            <CheckCircle size="60" color="#06ffcc" />
          </Balancer>
          <p className="text-xl">
            Thanks for your interest in hiring tools from NearbyTools and
            joining the waitlist. We will email you the details on how to access
            the available tools as soon as we have curated the list. We
            appreciate your support and patient.
            <br />
            <br />
            Meanwhile, if you would like to list you tools on the platform,
            please do so from the home page
          </p>
          <br />
          <button className="btn btn-primary">
            <Link href="/">Home</Link>
          </button>
        </div>
      </div>
    </>
  );
}

export default ThankYou;

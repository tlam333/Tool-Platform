/**This is home page */
import { Metadata } from "next";
import { Search, Send, HeartHandshake } from "lucide-react";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import ReviewCarousal from "@/components/shared/ReviewCarousal";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const listToolsWorking = [
    {
      sn: "01",
      title: "List Tools",
      description:
        "List your tools and equipment for free. Set your own price, security deposit and availability.",
    },
    {
      sn: "02",
      title: "Receive Hire Requests",
      description:
        "Receive hire requests from other members. Accept or decline at your discretion.",
    },
    {
      sn: "03",
      title: "Get Paid",
      description:
        "Meet your hirer and hand over the tools. You get paid at the end of booking periode.",
    },
  ];
  const hireToolsWorking = [
    {
      sn: <Search size={60} />,
      title: "Find Tools",
      description:
        "Search for tools and equipment in your area. Compare prices and reviews.",
    },
    {
      sn: <Send size={60} />,
      title: "Make a Request",
      description:
        "Make a request to hire the tools. The owner will accept or decline your request.",
    },
    {
      sn: <HeartHandshake size={60} />,
      title: "Meet and Pickup",
      description:
        "Meet the owner and pick up the tools. You will be charged once the hire request is accepted.",
    },
  ];
  const reviews = [
    {
      user: "Josh",
      reviewText:
        "As a sustainability enthusiast, I'm thrilled to be a part of NearbyTools' mission. Sharing tools, reducing waste, and collaborating with neighbours is incredibly fulfilling.",
    },
    {
      user: "Mary",
      reviewText:
        "NearbyTools is a great way to make extra money from my tools and equipment. I love the flexibility and convenience of being able to set my own prices and availability.",
    },
    {
      user: "Jane",
      reviewText:
        "I've been using NearbyTools for a few weeks now and I'm impressed with the quality of tools available. I've saved a bundle on my DIY projects!",
    },
  ];
  return (
    <>
      <div className="hero py-10 md:min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-full">
            <h1 className="font-bold">Go Green, Rent Tools and Equipment</h1>
            <h2 className="py-8">
              Elevate Your Projects and DIY with Easy Access to Quality Tools
              for Hire
            </h2>

            <p className="hidden py-8 md:block">
              <Balancer>
                Welcome to the Future of Tool Sharing! 🛠️ Imagine having instant
                access to a treasure trove of tools and equipment right in your
                neighborhood. Say goodbye to costly purchases and cluttered
                garages. Our revolutionary tool sharing platform connects you
                with top-notch tools while fostering a strong sense of
                community.
              </Balancer>
            </p>
            <p className="py-5 md:py-8">
              <Balancer>
                We are currently live in Melbourne Metro region. Coming soon to
                other regions of Victoria!
              </Balancer>
            </p>

            <div className="flex flex-row justify-around max-w-2xl mx-auto">
              <Link
                href="/list-for-hire"
                className="btn btn-primary md:btn-wide"
              >
                List Tools
              </Link>

              <Link href="/for-hire" className="btn btn-primary md:btn-wide">
                Hire Tools
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="hero bg-base-200 py-10">
        <div className="hero-content text-center">
          <div className="max-w-full">
            <h1>Earn While You Share!</h1>
            <p className="py-6">
              <Balancer>
                Got tools gathering dust? Turn them into extra cash! List your
                underused tools & equipment on our platform. It's a win-win –
                you declutter your space and boost your wallet. Join the sharing
                economy and make your tools work for you! 🛠️🔗
              </Balancer>
            </p>
            <div className="grid grid-cols-3 gap-2">
              {listToolsWorking.map((item) => (
                <>
                  <div className="col-span-1 py-5" key={item.sn}>
                    <h1 className="text-7xl font-bold text-primary">
                      {item.sn}
                    </h1>
                  </div>
                  <div
                    className="col-span-2 text-left py-5"
                    key={item.sn + item.title}
                  >
                    <h2>{item.title}</h2>
                    <p>
                      <Balancer>{item.description} </Balancer>
                    </p>
                  </div>
                </>
              ))}
            </div>
            <Link href="/list-for-hire" className="btn btn-primary md:btn-wide">
              List Tools
            </Link>
          </div>
        </div>
      </div>
      <div className="hero py-10">
        <div className="hero-content text-center">
          <div className="max-w-full">
            <h1>Rent Tools When You Need Them!</h1>
            <p className="py-6">
              <Balancer>
                Building a treehouse? Crafting custom furniture? Or need tools
                for your one off jobs? Why spend a fortune on tools you'll only
                use occasionally? You can easily borrow what you need, when you
                need it.
              </Balancer>
            </p>

            <div className="flex flex-col md:flex-row py-5">
              {hireToolsWorking.map((item) => (
                <>
                  <div className="py-5" key={item.title}>
                    <Balancer>
                      <span className="text-primary">{item.sn}</span>
                    </Balancer>
                    <h2>{item.title}</h2>

                    <p className="py-5">
                      <Balancer>{item.description} </Balancer>
                    </p>
                  </div>
                </>
              ))}
            </div>
            <Link href="/for-hire" className="btn btn-primary md:btn-wide">
              Hire Tools
            </Link>
          </div>
        </div>
      </div>
      <div className="hero bg-base-200 py-10">
        <div className="hero-content text-center p-0.5">
          <div className="max-w-full">
            <h1>Reviews From our Users!</h1>
            <ReviewCarousal reviews={reviews} />
          </div>
        </div>
      </div>
    </>
  );
}

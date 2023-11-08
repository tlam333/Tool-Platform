"use client";
import useScroll from "@/lib/hooks/use-scroll";
import Image from "next/image";
import Link from "next/link";
import { Search, PlusCircle, AlignJustify, HelpCircle } from "lucide-react";
import { useSignInModal } from "./SignInModal";
import UserDropdown from "./UserDropDown";
import { useSession } from "next-auth/react";

const NavbarResponsive = () => {
  const scrolled = useScroll(50);
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const { data: session } = useSession();
  const MenuItems = [
    {
      name: "List Tools",
      link: "/list-for-hire",
      icon: <PlusCircle />,
      className: "btn btn-cta",
    },
    {
      name: "Hire Tools",
      link: "/for-rent",
      icon: <Search />,
      className: "btn btn-ghost",
    },
    {
      name: "FAQ",
      link: "/faq",
      icon: <HelpCircle />,
      className: "btn btn-ghost",
    },
  ];
  return (
    <>
      <SignInModal />
      <div
        className={`fixed top-0 flex w-full justify-center ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 shadow-md backdrop-blur-xl"
            : "bg-base-100"
        } z-30 transition-all`}
      >
        <div className="navbar max-w-screen-xl justify-between bg-base-100">
          <div className="navbar-start w-3/4">
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost md:hidden">
                <AlignJustify />
              </label>
              <ul
                tabIndex={0}
                className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow"
              >
                {MenuItems.map((item) => {
                  return (
                    <li
                      key={item.name + "mobile"}
                      className="content-between my-2"
                    >
                      <Link
                        href={item.link}
                        className={`text-xl normal-case ${item.className}`}
                      >
                        {item.icon} <p>{item.name}</p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            {/* Website logo */}
            <div className="mx-2 px-2">
              <Link href="/">
                <Image
                  src="/logo-full.png"
                  alt="nearbytools logo"
                  width="300"
                  height="85"
                  className="mr-2 rounded-sm"
                  style={{ width: "auto" }}
                  priority={true}
                ></Image>
              </Link>
            </div>
          </div>
          {/* Desktop menu only shows for lg and up devices */}
          <div className="hidden flex-none md:block">
            <ul className="menu menu-horizontal px-1">
              {MenuItems.map((item) => {
                return (
                  <li key={item.link} className="mx-1">
                    <Link
                      href={item.link}
                      className={`flex items-center ${item.className}`}
                    >
                      {item.icon} <p>{item.name}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="navbar-end">
            <>
              {session ? (
                <UserDropdown session={session} />
              ) : (
                <>
                  <button
                    className="rounded-full border border-black bg-secondary p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                    onClick={() => setShowSignInModal(true)}
                  >
                    Sign In
                  </button>
                </>
              )}
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarResponsive;

"use client";
import useScroll from "@/lib/hooks/use-scroll";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  PlusCircle,
  User,
  AlignJustify,
  HelpCircle,
} from "lucide-react";

const NavbarResponsive = () => {
  const scrolled = useScroll(50);
  const MenuItems = [
    { name: "List Tools", link: "/list-for-hire", icon: <PlusCircle /> },
    { name: "Hire Tools", link: "/for-rent", icon: <Search /> },
    // { name: "Others", link: "/", icon: <User /> },
    { name: "FAQ", link: "/faq", icon: <HelpCircle /> },
  ];
  return (
    <div
      className={`fixed top-0 flex w-full justify-center ${
        scrolled
          ? "border-b border-gray-200 bg-white/50 shadow-md backdrop-blur-xl"
          : "bg-base-100"
      } z-30 transition-all`}
    >
      <div className="navbar max-w-screen-xl justify-between bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <AlignJustify />
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow"
            >
              {MenuItems.map((item) => {
                return (
                  <li key={item.name + "mobile"}>
                    <Link
                      href={item.link}
                      className="flex items-center font-display text-xl normal-case"
                    >
                      {item.icon} <p>{item.name}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Website logo */}
          <div className="mx-2 flex-1 px-2">
            <Link href="/" className="flex items-center font-display text-2xl">
              <Image
                src="/logo.png"
                alt="nearbytools logo"
                width="44"
                height="44"
                className="mr-2 rounded-sm"
              ></Image>
              <h2>Nearby Tools</h2>
            </Link>
          </div>
        </div>
        {/* Desktop menu only shows for lg and up devices */}
        <div className="hidden flex-none lg:block">
          <ul className="menu menu-horizontal px-1">
            {MenuItems.map((item) => {
              return (
                <li key={item.name} className="mx-1">
                  <Link
                    href={item.link}
                    className="flex items-center font-display text-xl normal-case hover:text-blue-500"
                  >
                    {item.icon} <p>{item.name}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        {/* <div className="navbar-end">
          <Link
            href="/"
            className="flex items-center font-display text-xl normal-case"
          >
            <User />
            <p>{}Sign Up</p>
          </Link>
        </div> */}
      </div>
    </div>
  );
};

export default NavbarResponsive;

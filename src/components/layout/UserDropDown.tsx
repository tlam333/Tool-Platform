"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { User } from "lucide-react";
import { truncate } from "@/lib/utils";

import { Session } from "next-auth";

export default function UserDropdown({ session }: { session: Session }) {
  const { email, image } = session?.user || {};

  if (!email) return null;

  return (
    <>
      <div className="relative inline-block text-left">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn m-1">
            <User />
            {/* {session?.user?.image && (
              <img
                //@ts-ignore
                src={image}
                alt="user"
                className="h-8 w-8 rounded-full object-cover"
              />
            )}
            {!session?.user?.image && (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-500" />
              </div>
            )} */}

            <div className="p-2 hidden lg:block">
              {session?.user?.name && (
                <p className="truncate text-sm font-medium text-gray-900">
                  {truncate(session?.user?.name, 20)}
                </p>
              )}
            </div>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li className="lg:hidden">
              <div className="p-2">
                {session?.user?.name && (
                  <p className="truncate text-sm font-medium text-gray-900">
                    {truncate(session?.user?.name, 20)}
                  </p>
                )}
              </div>
            </li>
            {/* <li>
              <button
                className="relative flex w-full cursor-not-allowed items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
                disabled
              >
                <LayoutDashboard className="h-4 w-4" />
                <p className="text-sm">Dashboard</p>
              </button>
            </li> */}
            <li>
              <button
                className="relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
                onClick={() => signOut()}
              >
                <LogOut className="h-4 w-4" />
                <p className="text-sm">Logout</p>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

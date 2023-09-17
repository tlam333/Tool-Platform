"use client";
import Image from "next/image";
import { ToolPlaceholderImg } from "@/lib/constants";
import { MapPin } from "lucide-react";
import { truncate } from "@/lib/utils";
import Modal from "@/components/shared/Modal";
import { useEffect, useState } from "react";
import BookForm from "./BookForm";
import PopOver from "../shared/PopOver";
interface Props {
  tool: Tool;
}
function DisplayTool({ tool }: Props) {
  const image =
    tool.images.length > 0 && tool.images[0].length > 0
      ? tool.images[0]
      : ToolPlaceholderImg;

  /** get window object to be passed in the show PopOver modal */

  return (
    <>
      <PopOver
        id="bookModal"
        heading="Request to book"
        subheading="Please fill this form to send a request to the owner!"
      >
        <BookForm tool={tool} />
      </PopOver>
      <div className="card-normal card w-80 border border-gray-200 bg-base-100 shadow-lg hover:shadow-2xl hover:outline-blue-500">
        <figure>
          <Image
            src={image}
            width={200}
            height={0}
            placeholder="blur"
            blurDataURL={
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P/+EQAFxwLSC8o+/gAAAABJRU5ErkJggg=="
            }
            alt={tool.name + "-image"}
          ></Image>
        </figure>
        <div className="card-body">
          <h2 className="card-title">
            {truncate(tool.name, 15)} ${tool.rent} {tool.duration}
          </h2>
          <p>
            {tool.category} by {tool.brand}
          </p>
          <div className="mt-2 inline-flex">
            <p>
              <MapPin color="#0078d4" />
            </p>
            <p> {tool.location}</p>
          </div>
          <div className="card-actions justify-center">
            <button
              className="btn btn-primary"
              onClick={() => document.getElementById("bookModal").showModal()}
            >
              Hire Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default DisplayTool;

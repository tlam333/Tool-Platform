"use client";
import Image from "next/image";
import { ToolPlaceholderImg } from "@/lib/constants";
import { MapPin } from "lucide-react";
import { truncate } from "@/lib/utils";
import { useState } from "react";
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

  const maxLen = 260;

  const [readMore, setReadMore] = useState(false);

  const showBookForm = () => {
    const obj = document.getElementById(tool.id) as HTMLDialogElement;
    if (obj) {
      obj.showModal();
    }
  };

  return (
    <>
      <PopOver
        id={tool.id}
        heading={`Request to book - ${tool.name}`}
        subheading="Please fill this form to send a request to the owner!"
      >
        <BookForm tool={tool} />
      </PopOver>
      <div className="card lg:card-side bg-base-100 shadow-xl hover:bg-white/50 card-bordered border-slate-200">
        <figure className="min-w-[256px] max-w-[512px]">
          <Image
            src={image}
            // className="min-w-[256px] max-w-[512px]"
            width={256}
            height={256}
            style={{ maxWidth: "256px", height: "auto" }}
            placeholder="blur"
            //sizes="100vw"
            blurDataURL={
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P/+EQAFxwLSC8o+/gAAAABJRU5ErkJggg=="
            }
            alt={tool.name + "-image"}
          ></Image>
        </figure>

        <div className="card-body justify-between ">
          <h2 className="card-title">
            {truncate(tool.name, 30)} ${tool.rent} {tool.duration}
          </h2>
          <div className="flex space-x-5 items-center">
            <p>
              {tool.category} by {tool.brand}
            </p>
          </div>
          <div className="my-2 inline-block align-middle">
            <p className="text-sm text-gray-600 ">
              {!readMore && (
                <>
                  {truncate(tool.description, maxLen)}
                  {tool.description.length > maxLen && (
                    <button
                      onClick={() => setReadMore(true)}
                      className="text-blue-600"
                    >
                      read more
                    </button>
                  )}
                </>
              )}
              {readMore && tool.description}
            </p>
          </div>
          <div className="card-actions justify-between align-bottom">
            <div className="flex space-x-5 items-center">
              <p>
                <MapPin color="#0078d4" />
              </p>
              <p className="text-lg">{tool.location}</p>
            </div>
            <button className="btn btn-primary" onClick={() => showBookForm()}>
              Hire Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default DisplayTool;

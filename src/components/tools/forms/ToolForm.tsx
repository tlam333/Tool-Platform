"use client";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { useState } from "react";
import Input from "@/components/tools/forms/Input";
import RadioInput from "@/components/tools/forms/RadioInput";
import FileUpload from "./FileUpload";
import Loading from "@/components/shared/Loading";
import { ToolCategories, RentalPeriods, imageUrl } from "@/lib/constants";
import { deleteFile } from "@/lib/services/S3.services";
import { createTool } from "@/lib/services/Tools.services";
import { CheckCircle } from "lucide-react";
import Balancer from "react-wrap-balancer";
import Link from "next/link";

interface Props {
  buttonText: string;
  user: string;
}

const schema = yup.object().shape({
  name: yup.string().required("Product Name is required"),
  brand: yup.string().required("Brand Name is required"),
  description: yup.string().required("Description is required"),
  category: yup
    .string()
    .required()
    .oneOf(ToolCategories, "Choose one Category"),
  rent: yup
    .number()
    .required("Rent fee is required")
    .typeError("Amount must be a number"),
  duration: yup
    .string()
    .required("Choose one Rent Duration")
    .oneOf(RentalPeriods),
  deposit: yup
    .number()
    .required("Deposit is required")
    .typeError("Amount must be a number"),
  images: yup.string().required("Images are required"),
  owner: yup.string().required("User is required"),
});

export default function ToolForm({ buttonText, user }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    shouldUseNativeValidation: true,
  });
  const [submitedStatus, setSubmitedStatus] = useState(false);

  const onSubmit = async (data: any) => {
    const validForm = await schema.isValid(data);
    if (!validForm) return false;
    const resp = await createTool(data);

    //show success message submit another tool button
    setSubmitedStatus(true);
  };
  const submitAnotherTool = () => {
    setSubmitedStatus(false);
    reset();
    setUploadedImages([]);
  };

  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleDeleteClick = async (imageInd: number) => {
    await deleteFile(uploadedImages[imageInd]);
    const filteredImages = uploadedImages.filter(
      (img, index) => index !== imageInd
    );
    setUploadedImages(filteredImages);
    setValue("images", filteredImages.toString());
  };

  const handleImageUpload = () => {
    setUploadedImages(getValues("images").split(","));
  };

  return (
    <>
      {!submitedStatus && (
        <form onSubmit={handleSubmit(onSubmit)} name="tool_form">
          <div className="grid grid-cols-1 gap-2 max-w-xl mx-auto px-3 xl:px-0">
            <input type="hidden" value={user} {...register("owner")} />
            <Input
              name="name"
              label="Product name"
              register={register}
              required
            />
            <Input
              name="brand"
              label="Brand name"
              register={register}
              required
            />
            <RadioInput
              name="category"
              label="Category"
              register={register}
              radioInput={ToolCategories}
              required
            />
            <Input name="rent" label="Hire rate" register={register} required />
            <RadioInput
              name="duration"
              label="Rate duration"
              register={register}
              radioInput={RentalPeriods}
              required
            />
            <Input
              name="deposit"
              label="Deposit"
              register={register}
              required
            />
            <Input
              name="description"
              label="Description"
              type="textarea"
              register={register}
              required
            />
            <FileUpload
              name="images"
              label="Upload a .png or .jpg image (max 5MB)."
              register={register}
              setValue={setValue}
              getValues={getValues}
              onChange={handleImageUpload}
              error={errors.images}
              required
            />
            <button type="submit" className="btn btn-primary mb-7">
              {isSubmitting ? <Loading /> : buttonText || "Submit"}
            </button>
          </div>
        </form>
      )}
      {!submitedStatus && uploadedImages.length > 0 && (
        <>
          <hr className="my-4" />
          <p className="text-center">Uploaded images</p>
          <br />
          <div className="flex flex-wrap-reverse gap-1 justify-center mb-2">
            {uploadedImages.map(
              (image, index) =>
                image && (
                  <div
                    onMouseEnter={() => setShowDeleteButton(true)}
                    onMouseLeave={() => setShowDeleteButton(false)}
                    style={{ position: "relative" }}
                    className="tooltip tooltip-error"
                    key={image + "div"}
                    data-tip="Delete image"
                  >
                    <Image
                      src={imageUrl + image}
                      width={256}
                      height={256}
                      style={{ maxWidth: "256px", height: "auto" }}
                      placeholder="blur"
                      blurDataURL={
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P/+EQAFxwLSC8o+/gAAAABJRU5ErkJggg=="
                      }
                      alt={"tool-image"}
                      key={image}
                    ></Image>

                    {showDeleteButton && (
                      <button
                        onClick={() => handleDeleteClick(index)}
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0",
                        }}
                        className="btn btn-circle btn-sm btn-error"
                        key={image + "button"}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                )
            )}
          </div>
        </>
      )}
      {submitedStatus && (
        <div className="mx-auto m-2 gap-3 text-center">
          <Balancer>
            <CheckCircle size="40" color="#08d4ab" />
          </Balancer>
          <h2 className="font-bold">Tool listed successfully!</h2>
          <br />
          <p>
            This tool is added successfully. You can add another tool or
            navigate to view listed tools.
          </p>
          <button onClick={submitAnotherTool} className="btn btn-primary mt-5">
            List another tool
          </button>
          <br />
          <Link href="/for-hire" className="btn m-5 btn-default">
            <p>View listed tools</p>
          </Link>
        </div>
      )}
    </>
  );
}

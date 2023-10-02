/**
 * Choose and upload images to s3 bucket
 * @returns uploaded url
 */

import {
  UseFormRegister,
  UseFormSetValue,
  UseFormGetValues,
  FieldError,
} from "react-hook-form";
import { uploadFile } from "@/lib/services/S3.services";
import Loading from "@/components/shared/Loading";
import { useState } from "react";

interface InputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  required?: boolean;
  error?: FieldError | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  divClassName?: string;
}

export default function FileUpload({
  name,
  label,
  register,
  setValue,
  getValues,
  required = false,
  error,
  onChange,
  divClassName = "flex flex-col gap-1",
}: InputProps) {
  const [uploading, setUploading] = useState(false);
  async function upload(event: React.ChangeEvent<HTMLInputElement>) {
    setUploading(true);
    const file = event.target.files?.[0]!;

    if (file == null) {
      event.target.type = "text";
      event.target.type = "file";
      return alert("No file selected.");
    } else if (file.size > Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE)) {
      event.target.type = "text";
      event.target.type = "file";
      alert("Image max size should be less than 5MB");
      return;
    }

    const key = await uploadFile(file);
    const currentImages = getValues("images");
    const finalImages =
      currentImages === undefined || currentImages === ""
        ? key
        : currentImages + "," + key;
    setValue(name, finalImages);
    onChange(event);
    /** Reset file input */
    event.target.type = "text";
    event.target.type = "file";
    setUploading(false);
    return;
  }
  return (
    <div className={divClassName}>
      <p className="text-left text-gray-600">
        {label}
        {required && <span className="text-red-500">*</span>}
      </p>
      {!uploading && (
        <>
          <input
            onChange={upload}
            type="file"
            accept="image/png, image/jpeg"
            className="file-input file-input-bordered file-input-info w-full"
          />
          <input type="hidden" {...register(name, { required })} />
          {error && <p className="text-yellow-500">{error.message}</p>}
          <br />
        </>
      )}
      {uploading && <Loading />}
    </div>
  );
}

"use client";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Loading from "@/components/shared/Loading";
import { useRouter, useSearchParams } from "next/navigation";
import { BaseSyntheticEvent } from "react";
import { useEffect } from "react";
import Input from "@/components/tools/forms/Input";
import { ToolCategories } from "@/lib/constants";
import DropDown from "./forms/DropDown";

function SearchForm() {
  const router = useRouter();
  //fetch existing search params
  const searchParams = useSearchParams();
  console.log("Search form called, category-", searchParams.get("categories"));
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");
  const keyword = searchParams.get("keyword") ?? undefined;
  const location = searchParams.get("location") ?? undefined;
  const categories = searchParams.get("categories") ?? undefined;

  const searchFormSchema = Yup.object().shape({
    keyword: Yup.string(),
    suburb: Yup.string(),
    categories: Yup.string(),
  });

  const { register, handleSubmit, reset, formState } = useForm({
    shouldUseNativeValidation: true,
    mode: "onChange",
    resolver: yupResolver(searchFormSchema),
  });
  const { isSubmitting } = formState;

  useEffect(() => {
    reset({
      keyword: keyword,
      suburb: location,
      categories: categories,
    });
  }, [keyword, location, categories]);

  const onApplyFilter = async (
    data: {
      keyword?: string | undefined;
      suburb?: string | undefined;
      categories?: string | undefined;
    },
    event?: BaseSyntheticEvent
  ) => {
    event?.preventDefault();

    let pushUrl = ``;
    if (data.keyword) {
      pushUrl = `keyword=${data.keyword}&`;
    }
    if (data.suburb) {
      pushUrl = pushUrl + `location=${data.suburb}&`;
      //remove spaces from suburb and implement in backend as well
      //pushUrl = pushUrl + `&location=${(data.suburb).replace(/\s/g, '')}`;
    }
    if (data.categories && data.categories?.length > 0) {
      pushUrl = pushUrl + `categories=${data.categories}`;
    }
    router.push(`?${pushUrl}`);
  };
  return (
    <>
      <div className="mx-auto mb-10 mt-10 gap-3 text-center max-w-5xl">
        <form onSubmit={handleSubmit(onApplyFilter)}>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-4 lg:grid-cols-4">
            <Input
              name="keyword"
              placeholder="Tool or equipment name"
              register={register}
              divClassName="col-span-1"
            />
            <Input
              name="suburb"
              placeholder="Suburb name"
              register={register}
              divClassName="col-span-1"
            />
            <DropDown
              name="categories"
              placeholder="Select categories"
              register={register}
              divClassName="col-span-1"
              list={ToolCategories}
            />

            <div className="col-span-1">
              <button className="btn btn-primary">
                {isSubmitting ? <Loading /> : "Search"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default SearchForm;

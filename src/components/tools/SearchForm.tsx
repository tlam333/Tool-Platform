"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Loading from "@/components/shared/Loading";
import { useRouter, useSearchParams } from "next/navigation";
import { BaseSyntheticEvent } from "react";

// interface Props {
//   onApplyFilter: (data: any) => void;
// }

function SearchForm() {
  const router = useRouter();
  //fetch existing search params
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");
  const keyword = searchParams.get("keyword") ?? undefined;
  const location = searchParams.get("location") ?? undefined;

  const searchFormSchema = Yup.object().shape({
    keyword: Yup.string(),
    suburb: Yup.string(),
  });

  const { register, handleSubmit, reset, formState, control } = useForm({
    shouldUseNativeValidation: true,
    mode: "onChange",
    resolver: yupResolver(searchFormSchema),
    defaultValues: {
      keyword: keyword,
      suburb: location,
    },
  });

  const { errors } = formState;
  const { isSubmitting } = formState;
  //const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data);
  const onApplyFilter = async (
    data: {
      keyword?: string | undefined;
      suburb?: string | undefined;
    },
    event?: BaseSyntheticEvent
  ) => {
    event?.preventDefault();
    //await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(data);
    let pushUrl = ``;
    if (data.keyword) {
      pushUrl = `&keyword=${data.keyword}`;
    }
    if (data.suburb) {
      pushUrl = pushUrl + `&location=${data.suburb}`;
      //remove spaces from suburb and implement in backend as well
      //pushUrl = pushUrl + `&location=${(data.suburb).replace(/\s/g, '')}`;
    }
    router.push(`?${pushUrl}`);
    //reset();
  };
  return (
    <>
      <div className="mx-auto mb-10 mt-10 gap-3 text-center max-w-5xl">
        <form onSubmit={handleSubmit(onApplyFilter)}>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-3">
            <div className="col-span-1">
              <input
                className="focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-3 leading-tight text-gray-700 shadow focus:outline-none"
                placeholder="Search for tools"
                {...register("keyword")}
              />
              <div className="invalid-feedback">
                {/* {errors.keyword?.message} */}
              </div>
            </div>
            <div className="col-span-1">
              <input
                className="focus:shadow-outline mb-5 w-full appearance-none rounded border px-3 py-3 leading-tight text-gray-700 shadow focus:outline-none"
                placeholder="Choose a suburb"
                {...register("suburb")}
              />
              {/* <div className="invalid-feedback">{errors.suburb?.message}</div> */}
            </div>
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

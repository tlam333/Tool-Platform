import Balancer from "react-wrap-balancer";
//import Filters from "@/components/tools/Filters";
import ToolList from "@/components/tools/ToolList";
// import { useForm } from "react-hook-form";
// import * as Yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
//import { DevTool } from "@hookform/devtools";
import Loading from "@/components/shared/Loading";
import PaginationControls from "@/components/shared/PaginationControls";
import { useRouter, useSearchParams } from "next/navigation";
//import * as ToolsAPI from "@/api/tools/route";
import type { Metadata } from "next";
import SearchForm from "@/components/tools/SearchForm";
import { Suspense } from "react";
import { getAllTools } from "@/lib/services/Tools.services";
import NoResultsFound from "@/components/tools/NoResultsFound";
import Alert from "@/components/shared/Alert";

export const metadata: Metadata = {
  title: "Hire Tools",
  description: "Find tools available for rent in your area",
};

export default async function FindTools({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  //const router = useRouter();
  // const searchParams = useSearchParams();
  const page = searchParams["page"] ?? "1";
  const limit = searchParams["limit"] ?? "5";
  const keyword = searchParams["keyword"] ?? "";
  const location = searchParams["location"] ?? "";
  const offset = searchParams["offset"] ?? "";
  const sortby = searchParams["sortby"] ?? "createdDate";
  searchParams["page"] = page;
  searchParams["limit"] = limit;
  searchParams["keyword"] = keyword;
  searchParams["location"] = location;
  searchParams["offset"] = offset;
  searchParams["sortby"] = sortby;

  //implement error handling for this api call
  const ToolsData: Promise<ToolsPage> = getAllTools(searchParams);
  const toolsPage = await ToolsData;
  const { tools, total, nextPage, message } = await toolsPage;

  return (
    <>
      <div className="px-2 md:px-2 lg:px-10 xl:px-20 w-full bg-base-200 min-h-screen">
        <div className="mx-auto mb-10 mt-10 gap-3 text-center max-w-5xl">
          <h1>
            <Balancer>
              Search and find tools available in your desired location.
            </Balancer>
          </h1>
        </div>
        <SearchForm />
        {/*<div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
           <div className="col-span-1">
            <Filters />
          </div> 
        <div className="col-span-3"> */}
        {tools.length > 0 && (
          <>
            <div className="mx-auto max-w-6xl">
              <Suspense fallback={<Loading />}>
                <ToolList tools={tools} />
              </Suspense>
            </div>
            <div className="mx-auto mb-10 mt-10 max-w-5xl gap-3 text-right">
              <PaginationControls
                total={total}
                nextPage={nextPage}
                defaultLimit={Number(limit)}
                message={message}
              ></PaginationControls>
            </div>
          </>
        )}
        {tools.length == 0 && (
          <div className="mx-auto mb-10 mt-10 gap-3 text-center max-w-5xl">
            <NoResultsFound />
          </div>
        )}
      </div>
      {message && <Alert message={message} />}
      {/* </div> */}
    </>
  );
}

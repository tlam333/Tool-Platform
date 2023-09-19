"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface Props {
  defaultLimit: number;
  total: number;
  nextPage?: string;
}

function PaginationControls({ defaultLimit, total, nextPage }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? defaultLimit.toString();
  const keyword = searchParams.get("keyword") ?? "";
  const location = searchParams.get("location") ?? "";

  //store the page numbr with next page offset in local storage
  var nextPageList = [{ page, nextPage }];

  var keywordLocation = ``;
  if (keyword) {
    keywordLocation = `&keyword=${keyword}`;
  }
  if (location) {
    keywordLocation = keywordLocation + `&location=${location}`;
  }
  useEffect(() => {
    const pages = window.sessionStorage.getItem("nextPageList");
    if (pages) {
      const pageData = JSON.parse(pages);
      pageData[Number(page) - 1] = nextPage;
      nextPageList = pageData;
    }
    window.sessionStorage.setItem("nextPageList", JSON.stringify(nextPageList));
  }, []);

  const setNextPage = (page: number) => () => {
    router.push(
      `?page=${page + 1}&limit=${limit}&offset=${nextPage}&${keywordLocation}`
    );
  };

  const setPreviousePage = (page: number) => () => {
    if (page === 2) {
      router.push(`?${keywordLocation}`);
    } else {
      //fetch the page numbr with next page offset from session storage
      const prevPageOffset = nextPageList[page - 3];
      router.push(
        `?page=${
          page - 1
        }&limit=${limit}&offset=${prevPageOffset}&${keywordLocation}`
      );
    }
  };

  return (
    <div className="join">
      <button
        className="join-item btn"
        onClick={setPreviousePage(Number(page))}
        disabled={Number(page) <= 1}
      >
        «
      </button>

      <button className="join-item btn">Page {page}</button>

      <button
        className="join-item btn"
        onClick={setNextPage(Number(page))}
        disabled={!nextPage}
      >
        »
      </button>
    </div>
  );
}

export default PaginationControls;

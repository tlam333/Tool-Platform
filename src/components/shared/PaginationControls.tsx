"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Props {
  defaultLimit: number;
  total: number;
  nextPage?: string;
  message?: string;
}

function PaginationControls({ defaultLimit, total, nextPage, message }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const limit = searchParams.get("limit") ?? defaultLimit.toString();
  const keyword = searchParams.get("keyword") ?? "";
  const location = searchParams.get("location") ?? "";

  const page =
    message && message.length > 0 ? "1" : searchParams.get("page") ?? "1";

  message = "";
  var keywordLocation = ``;
  const pages = [];
  pages[Number(page)] = nextPage;
  const [nextPageList, setNextPageList] = useState(pages);

  useEffect(() => {
    const pages = window.sessionStorage.getItem("nextPageList");

    if (pages && pages.length > 0) {
      let pageData = JSON.parse(pages);
      pageData[Number(page)] = nextPage;

      setNextPageList(pageData);
      window.sessionStorage.setItem(
        "nextPageList",
        JSON.stringify(nextPageList)
      );
    } else {
      window.sessionStorage.setItem(
        "nextPageList",
        JSON.stringify(nextPageList)
      );
    }
  }, [page, nextPage]);

  if (keyword) {
    keywordLocation = `&keyword=${keyword}`;
  }
  if (location) {
    keywordLocation = keywordLocation + `&location=${location}`;
  }

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
      const prevPageOffset = nextPageList[page - 2];
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

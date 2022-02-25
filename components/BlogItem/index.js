import React from "react";
import dayjs from "dayjs";

import { Trans } from "I18N";

export default function BlogItem({ blog }) {
  const { title, keywords, date, length, url } = blog || {};
  return (
    <a href={url}>
      <div className="card mb-[15px] flex-row items-center justify-between p-[15px] md:mb-[20px] md:flex md:p-[20px]">
        <div className="flex-auto md:w-0">
          <div className="mb-[10px] overflow-hidden overflow-ellipsis whitespace-nowrap text-[14px] font-bold leading-[16px] md:mb-[10px]">
            {title}
          </div>
          <div className="overflow-hidden overflow-ellipsis whitespace-nowrap text-[12px] leading-[14px]">
            {keywords.replace(/\,/g, ", ")}
          </div>
        </div>
        <div className="mt-[15px] flex flex-row items-center justify-between md:hidden">
          <div className="mr-auto cursor-pointer text-[16px] font-bold">
            <Trans>view</Trans>
          </div>
          <span className="iconfont icontime mr-[4px] text-[16px]"></span>
          <span className="mr-[15px] inline-block min-w-[50px] text-[14px]">
            {parseInt(length / 300)}
            <Trans>min</Trans>
          </span>
          <span className="iconfont icondate mr-[4px] text-[16px]"></span>
          <span className="inline-block  min-w-[80px] text-[14px]">
            {dayjs(date).format("YYYY-MM-DD")}
          </span>
        </div>
        <div className="hidden flex-none items-center justify-between md:flex">
          <span className="iconfont icontime mr-[4px] text-[16px]"></span>
          <span className="mr-[15px] inline-block min-w-[50px] text-[14px]">
            {parseInt(length / 300)}
            <Trans>min</Trans>
          </span>
          <span className="iconfont icondate mr-[4px] text-[16px]"></span>
          <span className="mr-[15px] inline-block  min-w-[80px] text-[14px]">
            {dayjs(date).format("YYYY-MM-DD")}
          </span>
          <div className="cursor-pointer rounded-[8px] bg-black px-[40px] py-[8px] text-white">
            <Trans>view</Trans>
          </div>
        </div>
      </div>
    </a>
  );
}

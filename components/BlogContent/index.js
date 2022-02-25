import dayjs from "dayjs";

import { Trans } from "I18N";

export default function BlogContent({ blog = {} }) {
  const { content, title, date, length, author, keywords } = blog || {};
  return (
    <>
      <div className="mb-[6px] mt-[20px] text-center text-xl font-medium md:mb-[10px] md:text-4xl md:font-bold xl:mb-[15px] xl:text-5xl">
        {title}
      </div>
      <div className="mb-[20px] whitespace-pre-wrap text-center text-[14px] font-light leading-[20px] text-gray-500 md:text-[16px]">
        {`${dayjs(date).format("YYYY-MM-DD")}  |  `}
        {parseInt(length / 300)}
        <Trans>min</Trans>
        {`  |  ${author}  |  `}
        <span className="md:hidden">{`\n`}</span>
        {keywords}
      </div>
      <article
        className="prose prose-sm mb-[15px] break-all md:prose md:mb-[20px] xl:prose-lg"
        dangerouslySetInnerHTML={{ __html: content }}
      ></article>
    </>
  );
}

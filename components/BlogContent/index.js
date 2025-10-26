import dayjs from "dayjs";
import BlogCatalog from "components/BlogCatalog";
import MermaidRenderer from "components/MermaidRenderer";
import { Trans } from "I18N";

export default function BlogContent({ blog = {} }) {
  const { content, title, date, length, author, keywords, catalog } =
    blog || {};
  return (
    <div className="box">
      <h1 className="mb-[6px] text-left text-xl font-medium md:mb-[10px] md:text-2xl md:font-bold xl:mb-[15px] xl:text-4xl">
        {title}
      </h1>
      <div className="mb-4 whitespace-pre-wrap text-left text-[12px] font-light leading-[20px] text-gray-500 md:mb-6 md:text-[14px] xl:mb-8">
        {`${dayjs(date).format("YYYY-MM-DD")}  |  `}
        {parseInt(length / 300)}
        <Trans>min</Trans>
        {`  |  ${author}  |  `}
        <span className="md:hidden">{`\n`}</span>
        {keywords}
      </div>
      {catalog && catalog.length > 0 && (
        <div className="mb-4 md:mb-6 xl:mb-8 xl:hidden">
          <BlogCatalog catalog={catalog} />
        </div>
      )}
      <article
        className="prose prose-sm mb-[15px] break-all md:prose md:mb-[20px]"
        dangerouslySetInnerHTML={{ __html: content }}
      ></article>
      <MermaidRenderer />
    </div>
  );
}

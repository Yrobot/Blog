import dayjs from 'dayjs';

import { Trans } from 'I18N';

export default function BlogContent({ blog = {} }) {
  const { content, title, createTime, length, author, keywords } = blog || {};
  return (
    <>
      <div className='text-center text-xl mb-6px md:text-4xl md:font-bold md:mb-10px 2xl:text-5xl 2xl:mb-15px font-medium'>{title}</div>
      <div className='text-center whitespace-pre-wrap text-gray-500 font-light text-14px leading-20px md:text-16px mb-20px'>
        {`${dayjs(createTime).format('YYYY-MM-DD')}  |  `}
        {parseInt(length / 300)}
        <Trans>min</Trans>
        {`  |  ${author}  |  `}
        <span className='md:hidden'>{`\n`}</span>
        {keywords}
      </div>
      <article
        className='prose prose-sm break-all md:prose 2xl:prose-lg mb-15px md:mb-20px'
        dangerouslySetInnerHTML={{ __html: content }}
      ></article>
    </>
  );
}

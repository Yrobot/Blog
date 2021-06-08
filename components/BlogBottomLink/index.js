export default function BlogBottomLink({ pre, next }) {
  return (
    <div className='overflow-hidden flex flex-row items-center justify-between pt-[10px] md:pt-[15px] border-t-[1px] border-gray-200 mb-[20px] md:mb-[40px]'>
      {pre && (
        <>
          <span className='iconfont iconleft flex-none w-[14px] h-[14px] text-[14px] md:w-[16px] md:h-[16px] md:text-[16px] md:mr-[4px]'></span>
          <a
            href={pre.url}
            className='flex-none w-40% text-[14px] leading-[16px] md:text-[16px] overflow-hidden whitespace-nowrap overflow-ellipsis'
          >
            {pre.title}
          </a>
        </>
      )}
      <div className='mx-auto'></div>
      {next && (
        <>
          <a
            href={next.url}
            className='flex-none w-40% text-right text-[14px] leading-[16px] md:text-[16px] overflow-hidden whitespace-nowrap overflow-ellipsis'
          >
            {next.title}
          </a>
          <span className='iconfont iconright flex-none w-[14px] h-[14px] text-[14px] md:w-[16px] md:h-[16px] md:text-[16px] md:ml-[4px]'></span>
        </>
      )}
    </div>
  );
}

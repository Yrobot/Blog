export default function BlogBottomLink({ pre, next }) {
  return (
    <div className="box flex flex-row items-center justify-between">
      {pre && (
        <>
          <span className="iconfont iconleft flex-none text-[14px] md:mr-[4px] md:text-[16px]"></span>
          <a
            href={pre.url}
            className="w-40% flex-none overflow-hidden overflow-ellipsis whitespace-nowrap text-[14px] leading-[16px] md:text-[16px]"
          >
            {pre.title}
          </a>
        </>
      )}
      <div className="mx-auto"></div>
      {next && (
        <>
          <a
            href={next.url}
            className="w-40% flex-none overflow-hidden overflow-ellipsis whitespace-nowrap text-right text-[14px] leading-[16px] md:text-[16px]"
          >
            {next.title}
          </a>
          <span className="iconfont iconright flex-none text-[14px] md:ml-[4px] md:text-[16px]"></span>
        </>
      )}
    </div>
  );
}

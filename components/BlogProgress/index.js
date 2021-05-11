import { Trans } from 'I18N';

export default function BlogProgress({ compeled = 0, progress = 0 }) {
  return (
    <div className='flex flex-row items-start justify-between mb-20px helvetica-neue'>
      <div className='card mr-15px md:mr-20px w-0 flex-auto py-20px flex flex-row items-center justify-center'>
        <div className='mr-15px md:mr-20px flex-none text-30px md:text-50px 2xl:text-64px'>{compeled}</div>
        <div className='flex-none text-14px md:text-16px 2xl:text-18px whitespace-pre'>
          <Trans>{`Blogs\ncompleted`}</Trans>
        </div>
      </div>
      <div className='card w-0 flex-auto py-20px flex flex-row items-center justify-center'>
        <div className='mr-15px md:mr-20px flex-none text-30px md:text-50px 2xl:text-64px'>{progress}</div>
        <div className='flex-none text-14px md:text-16px 2xl:text-18px whitespace-pre'>
          <Trans>{`Blogs\nin progress`}</Trans>
        </div>
      </div>
    </div>
  );
}

import { Trans } from 'I18N';

export default function NotFound(props) {
  return (
    <div className='mx-auto 2xl:max-w-[800px]'>
      <img src='/assets/404.png' alt='404' className='w-full' />
      <div className='text-center mt-[60px] md:text-[20px] md:leading-[24px] 2xl:text-[24px] 2xl:leading-[28px]'>
        <Trans>The page can’t be found, please take a look at the homepage</Trans>
      </div>
      <div className='text-center mt-[60px]'>
        <a
          href='/'
          className='inline-block bg-black text-white rounded-[14px] cursor-pointer select-none py-[20px] px-[50px] text-[14px] leading-[16px] md:text-[18px] md:leading-[20px] 2xl:text-[20px] 2xl:leading-[24px]'
        >
          <Trans>back to homepage</Trans>
        </a>
      </div>
    </div>
  );
}

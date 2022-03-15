import { Trans } from 'I18N';

export default function NotFound(props) {
  return (
    <div className='mx-auto xl:max-w-[700px]'>
      <img src='/assets/404.png' alt='404' className='w-full' />
      <div className='text-center mt-[60px] md:text-[20px] md:leading-[24px] xl:text-[24px] xl:leading-[28px]'>
        <Trans>The page can’t be found, please take a look at the homepage</Trans>
      </div>
      <div className='text-center mt-14'>
        <a
          href='/'
          className='inline-block button md:button-lg'
        >
          <Trans>back to homepage</Trans>
        </a>
      </div>
    </div>
  );
}

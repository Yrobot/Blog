import { Trans } from 'I18N';

export default function WelcomeCard(props) {
  return (
    <div className='pt-[24px] md:pt-[24px] 2xl:pt-[30px] mb-[15px] md:mb-[20px]'>
      <div className='relative card pl-[20px] flex flex-col items-start justify-center h-[96px] md:h-[126px] 2xl:h-[160px] pr-[120px] md:pr-[170px] 2xl:pr-[195px]'>
        <div className='text-[20px] md:text-[26px] 2xl:text-[36px] font-bold mb-[10px] md:mb-[15px] 2xl:mb-[15px]'>
          <Trans>Hi! I am Yrobot</Trans>
        </div>
        <div className='text-[14px] md:text-[16px] 2xl:text-[16px]'>
          <Trans>Welcome to my blog, wish you a good time here!</Trans>
        </div>
        <img
          className='h-[120px] md:h-[150px] 2xl:h-[190px] absolute bottom-0 right-[20px]'
          src='https://gitee.com/yrobot/images/raw/master/2021-06-09/my-profile-16-47-21.svg'
          alt='person'
        />
      </div>
    </div>
  );
}

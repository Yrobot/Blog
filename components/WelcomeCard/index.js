import { Trans } from "I18N";

export default function WelcomeCard(props) {
  return (
    <div className="pt-[24px] md:pt-[24px] xl:pt-[30px]">
      <div className="card relative flex h-[96px] flex-col items-start justify-center pl-[20px] pr-[120px] md:h-[126px] md:pr-[170px] xl:h-[160px] xl:pr-[195px]">
        <div className="mb-[10px] text-[20px] font-bold md:mb-[15px] md:text-[26px] xl:mb-[15px] xl:text-[36px]">
          <Trans>Hi! I am Yrobot</Trans>
        </div>
        <div className="text-[14px] md:text-[16px] xl:text-[16px]">
          <Trans>Welcome to my blog, wish you a good time here!</Trans>
        </div>
        <img
          className="absolute bottom-0 right-[20px] h-[120px] md:h-[150px] xl:h-[190px]"
          src="/assets/my-profile.svg"
          alt="person"
        />
      </div>
    </div>
  );
}

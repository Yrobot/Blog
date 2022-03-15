import { Trans } from "I18N";

export default function WelcomeCard(props) {
  return (
    <div className="pt-[24px] md:pt-[24px] xl:pt-[30px]">
      <div className="card relative flex h-[96px] flex-col items-start justify-center pl-5 pr-[100px] md:h-[126px] md:pr-[170px] xl:h-[160px] xl:pr-[195px]">
        <div className="mb-2 text-xl font-bold md:mb-4 md:text-2xl xl:text-4xl">
          <Trans>Hi! I am Yrobot</Trans>
        </div>
        <div className="text-xs md:text-base">
          <Trans>Welcome to my blog, wish you a good time here!</Trans>
        </div>
        <img
          className="absolute bottom-0 right-space h-[120px] md:h-[150px] xl:h-[190px]"
          src="/assets/my-profile.svg"
          alt="person"
        />
      </div>
    </div>
  );
}

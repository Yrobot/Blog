import { Trans } from "I18N";

export default function BlogProgress({ compeled = 0, progress = 0 }) {
  return (
    <div className="helvetica-neue mb-space flex flex-row items-start justify-between">
      <div className="card mr-space flex w-0 flex-auto flex-row items-center justify-center py-space">
        <div className="mr-space flex-none text-3xl md:mr-space md:text-5xl xl:text-6xl">
          {compeled}
        </div>
        <div className="flex-none whitespace-pre text-sm md:text-base xl:text-xl">
          <Trans>{`Blogs\ncompleted`}</Trans>
        </div>
      </div>
      <div className="card flex w-0 flex-auto flex-row items-center justify-center py-space">
        <div className="mr-space flex-none text-3xl md:mr-space md:text-5xl xl:text-6xl">
          {progress}
        </div>
        <div className="flex-none whitespace-pre text-sm md:text-base xl:text-xl">
          <Trans>{`Blogs\nin progress`}</Trans>
        </div>
      </div>
    </div>
  );
}

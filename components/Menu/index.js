import { TransConsumer } from "I18N";

const localIcons = {
  en: {
    icon: "iconchinese",
    value: "zh",
  },
  zh: {
    icon: "iconenglish",
    value: "en",
  },
};

function Language({ local, setLocal }) {
  const { icon, value } = localIcons[local] || {};
  return (
    <a
      className={
        "iconfont mr-[15px] flex-none cursor-pointer text-[20px] md:mr-0 md:mb-[20px] md:text-[30px] xl:mb-[50px] " +
        icon
      }
      onClick={() => {
        setLocal(value);
      }}
    ></a>
  );
}

export default function Menu({ home = false }) {
  return (
    <div className="card menu mb-[20px] flex h-[60px] flex-row items-center justify-between md:sticky md:top-space md:h-[80vh] md:max-h-[700px] md:min-h-[500px] md:w-[90px] md:flex-none md:flex-col xl:w-[120px]">
      <a className="iconfont iconlogo mr-auto ml-[15px] flex-none text-[30px] md:ml-0 md:mr-0 md:mt-[20px] md:mb-auto md:text-[50px] xl:h-[60px] xl:w-[60px] xl:text-[60px]"></a>
      {home && (
        <a
          className="iconfont iconhome mr-[20px] flex-none cursor-pointer text-[20px] md:mr-0 md:mb-[50px] md:text-[30px]"
          href="/"
        ></a>
      )}
      <a
        className="iconfont icongithub mr-[20px] flex-none cursor-pointer text-[20px] md:mr-0 md:mb-[50px] md:text-[30px]"
        target="_blank"
        href="https://github.com/Yrobot"
      ></a>
      <a
        className="iconfont iconemail mr-[20px] flex-none cursor-pointer text-[20px] md:mr-0 md:mb-[50px] md:text-[30px]"
        href="mailto:y_robot@yeah.net?subject="
      ></a>
      <TransConsumer>
        <Language />
      </TransConsumer>
    </div>
  );
}

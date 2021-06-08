import { TransConsumer } from 'I18N';

const localIcons = {
  en: {
    icon: 'iconchinese',
    value: 'zh',
  },
  zh: {
    icon: 'iconenglish',
    value: 'en',
  },
};

function Language({ local, setLocal }) {
  const { icon, value } = localIcons[local] || {};
  return (
    <a
      className={
        'iconfont cursor-pointer flex-none w-[20px] h-[20px] text-[20px] mr-[15px] md:mr-0 md:mb-[20px] 2xl:mb-[50px] md:w-[30px] md:h-[30px] md:text-[30px] ' +
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
    <div className='card menu h-[60px] md:sticky md:top-[20px] md:flex-none md:w-[90px] md:h-[600px] md:mr-[20px] 2xl:w-[120px] 2xl:h-[850px] 2xl: 2xl:mr-[50px] flex flex-row items-center justify-between md:flex-col mb-[20px]'>
      <a className='iconfont iconlogo flex-none mr-auto ml-[15px] md:ml-0 md:mr-0 md:mt-[20px] md:mb-auto w-[30px] h-[30px] text-[30px] md:w-[50px] md:h-[50px] md:text-[50px] 2xl:w-[60px] 2xl:h-[60px] 2xl:text-[60px]'></a>
      {home && (
        <a
          className='iconfont iconhome cursor-pointer flex-none w-[20px] h-[20px] text-[20px] mr-[20px] md:mr-0 md:mb-[50px] md:w-[30px] md:h-[30px] md:text-[30px]'
          href='/'
        ></a>
      )}
      <a
        className='iconfont icongithub cursor-pointer flex-none w-[20px] h-[20px] text-[20px] mr-[20px] md:mr-0 md:mb-[50px] md:w-[30px] md:h-[30px] md:text-[30px]'
        target='_blank'
        href='https://github.com/Yrobot'
      ></a>
      <a
        className='iconfont iconemail cursor-pointer flex-none w-[20px] h-[20px] text-[20px]  mr-[20px] md:mr-0 md:mb-[50px] md:w-[30px] md:h-[30px] md:text-[30px]'
        href='mailto:y_robot@yeah.net?subject='
      ></a>
      <TransConsumer>
        <Language />
      </TransConsumer>
    </div>
  );
}

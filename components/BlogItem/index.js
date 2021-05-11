import React from 'react';
import dayjs from 'dayjs';

import { Trans } from 'I18N';

export default function BlogItem({ blog }) {
  const { title, keywords, createTime, length } = blog || {};
  return (
    <div className='card p-15px mb-15px md:p-20px md:mb-20px md:flex flex-row items-center justify-between'>
      <div className='flex-auto md:w-0'>
        <div className='text-16px leading-18px font-bold mb-4px md:mb-10px overflow-hidden whitespace-nowrap overflow-ellipsis'>
          {title}
        </div>
        <div className='text-14px leading-16px overflow-hidden whitespace-nowrap overflow-ellipsis'>
          {keywords.replace(/\,/g, ', ')}
        </div>
      </div>
      <div className='flex flex-row items-center justify-between mt-15px md:hidden'>
        <div className='text-16px font-bold mr-auto cursor-pointer'>
          <Trans>view</Trans>
        </div>
        <span className='iconfont icondate w-16px h-16px text-16px mr-4px'></span>
        <span className='text-14px mr-15px'>
          {parseInt(length / 300)}
          <Trans>min</Trans>
        </span>
        <span className='iconfont icontime w-16px h-16px text-16px mr-4px'></span>
        <span className='text-14px'>{dayjs(createTime).format('YYYY-MM-DD')}</span>
      </div>
      <div className='hidden md:flex flex-none items-center justify-between'>
        <span className='iconfont icondate w-16px h-16px text-16px mr-4px'></span>
        <span className='text-14px mr-15px'>
          {parseInt(length / 300)}
          <Trans>min</Trans>
        </span>
        <span className='iconfont icontime w-16px h-16px text-16px mr-4px'></span>
        <span className='text-14px mr-15px'>{dayjs(createTime).format('YYYY-MM-DD')}</span>
        <div className='px-40px py-8px bg-black text-white rounded-8px cursor-pointer'>
          <Trans>view</Trans>
        </div>
      </div>
    </div>
  );
}

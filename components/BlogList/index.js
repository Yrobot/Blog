import { useState, useMemo } from 'react';

import { Trans } from 'I18N';
import BlogItem from 'components/BlogItem';

export default function BlogList({ typePosts = [] }) {
  const [type, setType] = useState('All');
  const list = useMemo(() => {
    for (let i = 0; i < typePosts.length; i++) {
      const { title, list = [] } = typePosts[i];
      if (type === title) return list;
    }
  }, [type]);
  return (
    <>
      <div className='text-20px md:text-24px mb-20px'>
        <Trans>Blogs</Trans>
      </div>
      <div className='text-14px md:text-16px mb-20px whitespace-nowrap overflow-x-scroll overflow-y-hidden select-none'>
        {typePosts.map(({ title }) => (
          <span
            key={title}
            onClick={() => {
              setType(title);
            }}
            className={`mr-40px cursor-pointer ${type === title ? '' : 'opacity-30'}`}
          >
            <Trans>{title}</Trans>
          </span>
        ))}
      </div>
      {list.map((blog, i) => (
        <BlogItem key={i} blog={blog} />
      ))}
    </>
  );
}

import { useState, useMemo } from "react";

import { Trans } from "I18N";
import BlogItem from "components/BlogItem";

export default function BlogList({ typePosts = [] }) {
  const [type, setType] = useState("All");
  const list = useMemo(() => {
    for (let i = 0; i < typePosts.length; i++) {
      const { title, list = [] } = typePosts[i];
      if (type === title) return list;
    }
  }, [type]);
  return (
    <>
      <div className="mb-4 text-xl md:text-2xl">
        <Trans>Blogs</Trans>
      </div>
      <div className="mb-4 flex select-none flex-row flex-wrap overflow-x-hidden overflow-y-scroll text-xs md:text-sm">
        {typePosts.map(({ title, list = [] }) => (
          <div
            key={title}
            onClick={() => {
              setType(title);
            }}
            className={`mr-2 mb-2 flex-none cursor-pointer whitespace-nowrap rounded-full border border-black px-2 py-1 text-black md:px-3 md:py-1 ${
              type === title ? "" : "opacity-30"
            }`}
          >
            <Trans>{title}</Trans> ({list.length})
          </div>
        ))}
      </div>
      {list.map((blog, i) => (
        <BlogItem key={i} blog={blog} />
      ))}
    </>
  );
}

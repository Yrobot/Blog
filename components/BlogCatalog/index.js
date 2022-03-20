import React, { useMemo } from "react";
import { Trans } from "I18N";

function BlogContentMenu({ catalog = [] }) {
  const catalogArray = useMemo(() => {
    const min = Math.min(...catalog.map(({ level }) => level));
    return catalog
      .map((item) => ({
        ...item,
        level: item.level - min,
      }))
      .filter(({ level }) => level < 4);
  }, [catalog]);
  if (catalogArray.length === 0) return null;
  return (
    <div className="catalog">
      <div className="title">
        <Trans>Catalog</Trans>
      </div>
      {catalogArray.map(({ text, level, anchor }) => (
        <div className={`line level-${level}`} key={anchor}>
          <a href={`#${anchor}`} dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      ))}
    </div>
  );
}
export default React.memo(BlogContentMenu);

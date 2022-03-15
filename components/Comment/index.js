import React, { useEffect, useRef } from "react";
import { useLocal } from "I18N";

const langs = {
  zh: "zh-CN",
  en: "en",
};

const loadValine = (props) => {
  if (typeof Valine !== "undefined") {
    new Valine({
      el: "#vcomments",
      appId: "OWG1JIpm4qdH4oKWhaTRYtyg-gzGzoHsz",
      appKey: "pkRlHOPGQicBGe2325oCTfHr",
      avatar: "hide",
      recordIP: true,
      requiredFields: ["nick"],
      visitor: true, // 阅读量统计
      ...props,
    });
  }
};

function Comment({
  placeholder: _p = "Any thoughts after reading?",
  ...props
}) {
  const [placeholder, _, local] = useLocal(_p);
  const ref = useRef(null);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//unpkg.com/valine/dist/Valine.min.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      loadValine({
        placeholder,
        lang: langs[local] || "zh-CN",
        ...props,
      });
    };
    ref.current.appendChild(script);
  }, []);
  useEffect(() => {
    loadValine({
      placeholder,
      lang: langs[local] || "zh-CN",
      ...props,
    });
  }, [placeholder]);
  return (
    <div className="box" ref={ref}>
      <div id="vcomments"></div>
    </div>
  );
}

export default React.memo(Comment);

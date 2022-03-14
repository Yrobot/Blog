import { useEffect } from 'react';
import { useLocal } from 'I18N';

const langs = {
  zh: 'zh-CN',
  en: 'en',
};

export default function Comment({ placeholder: _p = 'Any thoughts after reading?', ...props }) {
  const [placeholder, _, local] = useLocal(_p);
  useEffect(() => {
    new Valine({
      el: '#vcomments',
      appId: 'OWG1JIpm4qdH4oKWhaTRYtyg-gzGzoHsz',
      appKey: 'pkRlHOPGQicBGe2325oCTfHr',
      avatar: 'hide',
      recordIP: true,
      requiredFields: ['nick'],
      placeholder,
      lang: langs[local] || 'zh-CN',
      ...props,
    });
  }, [placeholder]);
  return (
    <div className='box'>
      <script src='//unpkg.com/valine/dist/Valine.min.js'></script>
      <div id='vcomments'></div>
    </div>
  );
}

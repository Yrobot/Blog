import { useEffect } from 'react';

import styles from './Comment.module.sass';

export default function Comment({ ...props }) {
  useEffect(() => {
    new Valine({
      el: '#vcomments',
      appId: 'OWG1JIpm4qdH4oKWhaTRYtyg-gzGzoHsz',
      appKey: 'pkRlHOPGQicBGe2325oCTfHr',
      placeholder: '看完之后有什么想法嘛？',
      avatar: 'hide',
      recordIP: true,
      requiredFields: ['nick'],
    });
  }, []);
  return (
    <div className={styles['comment-holder']}>
      <div id='vcomments'>
        <script src='//unpkg.com/valine/dist/Valine.min.js'></script>
      </div>
    </div>
  );
}

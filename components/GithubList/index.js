import GithubCard from '../GithubCard';

const commonParams = {
  username: 'yrobot',
  title_color: '000000',
  icon_color: '000000',
  text_color: '000000',
  border_color: 'F4F4F5',
  bg_color: 'F4F4F5',
};

const list = [
  {
    src: 'https://github-readme-stats.vercel.app/api',
    params: {
      count_private: true,
      show_icons: true,
      ...commonParams,
    },
    href: 'https://github.com/Yrobot',
  },
  {
    src: 'https://github-readme-stats.vercel.app/api/pin',
    params: {
      repo: 'mina-touch',
      ...commonParams,
    },
    href: 'https://github.com/Yrobot/mina-touch',
  },
  {
    src: 'https://github-readme-stats.vercel.app/api/pin',
    params: {
      repo: 'react-mobile-table',
      ...commonParams,
    },
    href: 'https://github.com/Yrobot/react-mobile-table',
  },
  {
    src: 'https://github-readme-stats.vercel.app/api/pin',
    params: {
      repo: 'mina-popups',
      ...commonParams,
    },
    href: 'https://github.com/Yrobot/mina-popups',
  },
];

export default function GithubList({ ...props }) {
  return (
    <>
      {list.map((props, i) => (
        <GithubCard {...props} key={i} />
      ))}
    </>
  );
}

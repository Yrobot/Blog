import GithubCard from "../GithubCard";

const commonParams = {
  username: "yrobot",
  title_color: "000000",
  icon_color: "000000",
  text_color: "000000",
  border_color: "ffffff",
  bg_color: "ffffff",
};

const GITHUB_STATS_DOMAIN = "https://github-stats.yrobot.top";

const list = [
  {
    src: `${GITHUB_STATS_DOMAIN}/api`,
    params: {
      count_private: true,
      show_icons: true,
      ...commonParams,
    },
    href: "https://github.com/Yrobot",
  },
  {
    src: `${GITHUB_STATS_DOMAIN}/api/pin`,
    params: {
      repo: "mina-touch",
      ...commonParams,
    },
    href: "https://github.com/Yrobot/mina-touch",
  },
  {
    src: `${GITHUB_STATS_DOMAIN}/api/pin`,
    params: {
      repo: "react-mobile-table",
      ...commonParams,
    },
    href: "https://github.com/Yrobot/react-mobile-table",
  },
  {
    src: `${GITHUB_STATS_DOMAIN}/api/pin`,
    params: {
      repo: "mina-tools-client",
      ...commonParams,
    },
    href: "https://github.com/Yrobot/mina-tools-client",
  },
  {
    src: `${GITHUB_STATS_DOMAIN}/api/pin`,
    params: {
      repo: "mina-popups",
      ...commonParams,
    },
    href: "https://github.com/Yrobot/mina-popups",
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

export default function GithubCard({ src = '', href = '', params = {} }) {
  return (
    <div className='card mb-15px md:mb-20px overflow-hidden'>
      <a href={href} target='_blank'>
        <img
          src={`${src}?${Object.entries(params).reduce(
            (pre, [key, value]) => `${pre}${pre ? '&' : ''}${key}=${value}`,
            '',
          )}`}
          alt='GithubCard'
        />
      </a>
    </div>
  );
}

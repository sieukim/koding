import { LinkOutlined, StopOutlined } from '@ant-design/icons';
import { IconText } from '../post/IconText';

export const UrlItem = (props) => {
  const { profileUser, className } = props;

  const blogUrl = profileUser.isBlogUrlPublic ? (
    <IconText
      icon={<LinkOutlined />}
      text={<a href={profileUser.blogUrl}>{profileUser.blogUrl}</a>}
      className="url-item-contents"
    />
  ) : (
    <IconText
      icon={<StopOutlined />}
      text="비공개 정보입니다."
      className="url-item-contents"
    />
  );

  const githubUrl = profileUser.isGithubUrlPublic ? (
    <IconText
      icon={<LinkOutlined />}
      text={<a href={profileUser.githubUrl}>{profileUser.githubUrl}</a>}
      className="url-item-contents"
    />
  ) : (
    <IconText
      icon={<StopOutlined />}
      text="비공개 정보입니다."
      className="url-item-contents"
    />
  );

  const portfolioUrl = profileUser.isPortfolioUrlPublic ? (
    <IconText
      icon={<LinkOutlined />}
      text={
        <a href={profileUser.portfolioUrl} className="url-item-contents">
          {profileUser.portfolioUrl}
        </a>
      }
    />
  ) : (
    <IconText
      icon={<StopOutlined />}
      text="비공개 정보입니다."
      className="url-item-contents"
    />
  );

  return (
    <div className={className}>
      <div className="url-item-blog">
        <p className="url-item-header">블로그</p>
        {blogUrl}
      </div>
      <div className="url-item-github">
        <p className="url-item-header">깃허브</p>
        {githubUrl}
      </div>
      <div className="url-item-portfolio">
        <p className="url-item-header">포트폴리오</p>
        {portfolioUrl}
      </div>
    </div>
  );
};

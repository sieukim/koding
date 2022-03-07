import { RankedPostList } from '../utils/home/RankedPostList';
import { StyledTitle } from '../styled/StyledTitle';
import { StyledHomePage } from '../styled/home/StyledHomePage';

const HomePresenter = ({ posts }) => {
  return (
    <StyledHomePage>
      <StyledTitle>✨ 오늘의 인기글 ✨</StyledTitle>
      <div className="card-container">
        <RankedPostList
          boardType="community"
          title="커뮤니티"
          posts={posts?.community}
        />
        <RankedPostList boardType="qna" title="Q&A" posts={posts?.qna} />
      </div>
      <div className="card-container">
        <RankedPostList
          boardType="recruit"
          title="채용 정보"
          posts={posts?.recruit}
        />
        <RankedPostList boardType="blog" title="블로그" posts={posts?.blog} />
      </div>
    </StyledHomePage>
  );
};

export default HomePresenter;

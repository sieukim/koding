import { RankedPostList } from '../utils/home/RankedPostList';
import { StyledTitle } from '../styled/StyledTitle';
import { StyledHomePage } from '../styled/home/StyledHomePage';

const HomePresenter = ({ posts }) => {
  return (
    <StyledHomePage>
      <StyledTitle>✨ 오늘의 인기글 ✨</StyledTitle>
      <div className="card-container">
        <RankedPostList
          boardType="common"
          title="커뮤니티"
          posts={posts?.common}
        />
        <RankedPostList
          boardType="question"
          title="Q&A"
          posts={posts?.question}
        />
      </div>
      <div className="card-container">
        <RankedPostList
          boardType="recruit"
          title="채용 정보"
          posts={posts?.recruit}
        />
        <RankedPostList
          boardType="column"
          title="블로그"
          posts={posts?.column}
        />
      </div>
    </StyledHomePage>
  );
};

export default HomePresenter;

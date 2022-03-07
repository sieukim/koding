import styled from 'styled-components';
import { PostList } from './utils/home/PostList';

const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin: 50px 0;
  padding: 32px;
  width: 900px;

  .title-text {
    text-align: center;
    font-weight: bold;
    font-size: 32px;
    margin-bottom: 24px;
  }

  .card-container {
    display: flex;
    justify-content: space-around;

    margin: 20px;
    width: 100%;

    .ant-card-bordered {
      width: 45%;
      min-height: 360px;
      border-radius: 30px;
    }
  }
`;

const HomePresenter = ({ posts }) => {
  return (
    <StyledHome>
      <div className="title-text">✨ 오늘의 인기글 ✨</div>

      <div className="card-container">
        <PostList
          boardType="community"
          title="커뮤니티"
          posts={posts?.community}
        />
        <PostList boardType="qna" title="Q&A" posts={posts?.qna} />
      </div>
      <div className="card-container">
        <PostList
          boardType="recruit"
          title="채용 정보"
          posts={posts?.recruit}
        />
        <PostList boardType="blog" title="블로그" posts={posts?.blog} />
      </div>
    </StyledHome>
  );
};

export default HomePresenter;

import styled from 'styled-components';
import { PostList } from '../utils/post/PostList';
import { Button, Divider, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { SearchByTag } from '../utils/search/SearchByTag';

const StyledBoard = styled.div`
  border: 1px solid rgb(217, 217, 217);
  border-radius: 8px;
  margin: 50px 0;
  padding: 32px;
  width: 900px;

  .title-text {
    text-align: center;
    font-weight: bold;
    font-size: 32px;
    margin-bottom: 24px;
  }

  .paragraph-text {
    text-align: center;
    font-weight: 200;
    font-size: 15px;
    margin-bottom: 24px;
  }

  .board-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 20px 0;

    .ant-input-affix-wrapper {
      .ant-input-suffix {
        font-size: 1rem;
        color: rgba(0, 0, 0, 0.45);
      }
    }

    .ant-btn {
      margin-left: 20px;
    }
  }
`;

const CommunityMent = () => {
  return (
    <>
      <div className="title-text">커뮤니티</div>
      <p className="paragraph-text">
        취준, 자소서, 코테 등의 다양한 이야기를 나누는 공간입니다.
        <br />
        🚫 타인에게 불쾌감을 주는 언행은 모두 신고해주세요! (비방, 욕설, 상업적
        광고, 정치 등) 🚫
      </p>
    </>
  );
};

const QnaMent = () => {
  return (
    <>
      <div className="title-text">Q&A</div>
      <p className="paragraph-text">
        프로그래밍 관련 질문을 주고 받는 공간입니다.
        <br />
        🚫 타인에게 불쾌감을 주는 언행은 모두 신고해주세요! (비방, 욕설, 상업적
        광고, 정치 등) 🚫
      </p>
    </>
  );
};

const RecruitMent = () => {
  return (
    <>
      <div className="title-text">채용 정보</div>
      <p className="paragraph-text">
        다양한 회사의 프로그래밍 관련 채용 공고를 확인하는 공간입니다.
        <br />
        🌸 모든 분들의 꽃길을 기원합니다. 🌸
      </p>
    </>
  );
};

const StudyGroupMent = () => {
  return (
    <>
      <div className="title-text">스터디 모집</div>
      <p className="paragraph-text">
        다양한 주제를 갖고 함께 공부할 그룹 스터디를 모집하는 공간힙니다.
        <br />✨ 좋은 공부, 좋은 인연을 만들길 기원합니다. ✨
      </p>
    </>
  );
};

const BlogMent = () => {
  return (
    <>
      <div className="title-text">블로그</div>
      <p className="paragraph-text">
        관심있는 주제의 글을 작성하는 공간입니다.
        <br />
        📝 공부한 내용을 정리하여 기록해보아요! 📝
      </p>
    </>
  );
};

const BoardPresenter = ({
  loading,
  boardType,
  posts,
  getPosts,
  nextPageCursor,
  onClickWrite,
  tagsParams,
  tagsList,
}) => {
  return (
    <StyledBoard>
      {boardType === 'common' && <CommunityMent />}
      {boardType === 'question' && <QnaMent />}
      {boardType === 'recruit' && <RecruitMent />}
      {boardType === 'study-group' && <StudyGroupMent />}
      {boardType === 'column' && <BlogMent />}
      <div className="board-header">
        <Input suffix={<SearchOutlined />} />
        {boardType !== 'recruit' && (
          <Button type="primary" onClick={onClickWrite}>
            게시글 작성
          </Button>
        )}
      </div>
      <SearchByTag
        boardType={boardType}
        tagsParams={tagsParams}
        tagsList={tagsList}
      />
      <Divider />
      <PostList
        loading={loading}
        posts={posts}
        next={getPosts}
        hasMore={nextPageCursor}
      />
    </StyledBoard>
  );
};

export default BoardPresenter;

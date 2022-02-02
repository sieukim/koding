import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { GetDate, PostLink, PrintState } from '../../../utils/MyComponents';
import TagPresenter from '../post/TagPresenter';
import { ProfileLink } from '../../../utils/ProfileLink';

const StyledBoard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .board {
    display: flex;
    flex-direction: column;
    padding: 5px;
    background: wheat;
    height: 632px;
  }

  .post-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
    margin: 10px;
    background: gainsboro;
  }

  .post-info {
    display: flex;
    flex-direction: row;
  }

  .post-createdAt {
    margin-left: 5px;
  }

  .paging-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  button {
    padding: 3px;
    margin: 5px;
    width: 10%;
  }

  .post-write {
    align-self: end;
  }
`;

const BoardPresenter = ({
  boardType,
  readBoardState,
  hasNextPage,
  hasPrevPage,
  onClickNextCursor,
  onClickPrevCursor,
  onClickWritePost,
  onChangeTag,
  tagList = [],
  posts = [],
}) => {
  // 로그인 유저 정보
  const user = useSelector((state) => state.auth.user);

  return (
    <StyledBoard>
      <PrintState state={readBoardState} />
      <TagPresenter tags={tagList} onChangeTag={onChangeTag} />
      <div className="board">
        {posts.map((post) => (
          <div className="post-item" key={post.postId}>
            <PostLink
              boardType={boardType}
              postId={post.postId}
              postTitle={post.title}
            />
            <div className="post-info">
              <ProfileLink nickname={post.writerNickname} />
              <GetDate date={post.createdAt} className="post-createdAt" />
            </div>
          </div>
        ))}
        <div className="paging-button">
          <button onClick={onClickPrevCursor} disabled={!hasPrevPage}>
            이전
          </button>
          <button onClick={onClickNextCursor} disabled={!hasNextPage}>
            다음
          </button>
        </div>
        {user && (
          <button onClick={onClickWritePost} className="post-write">
            글 쓰기
          </button>
        )}
      </div>
    </StyledBoard>
  );
};

export default BoardPresenter;

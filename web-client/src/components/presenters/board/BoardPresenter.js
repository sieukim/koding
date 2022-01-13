import styled from 'styled-components';
import { useSelector } from 'react-redux';
import {
  GetDate,
  MyPageLink,
  PostLink,
  PrintState,
} from '../../../utils/MyComponents';
import TagPresenter from '../post/TagPresenter';
import { autoCompleteTags } from '../../../utils/tag';

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
}) => {
  // 로그인 유저 정보
  const user = useSelector((state) => state.auth.user);

  return (
    <StyledBoard>
      <PrintState state={readBoardState} />
      <TagPresenter tags={autoCompleteTags} onChangeTag={onChangeTag} />
      {readBoardState.success && (
        <div className="board">
          {readBoardState.success.data.posts.map((post) => (
            <div className="post-item" key={post.postId}>
              <PostLink
                boardType={boardType}
                postId={post.postId}
                postTitle={post.title}
              />
              <div className="post-info">
                <MyPageLink nickname={post.writerNickname} />
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
      )}
    </StyledBoard>
  );
};

export default BoardPresenter;

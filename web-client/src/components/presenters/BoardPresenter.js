import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getDate } from '../../utils/getDate';

const StyledBoard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .post-list {
    display: flex;
    flex-direction: column;
    padding: 5px;
    background: wheat;
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

  .post-write {
    text-align: right;
    padding: 5px;
    margin: 5px;
  }
`;

const BoardPresenter = ({ boardType, readBoardState }) => {
  // 로그인 유저 정보
  const user = useSelector((state) => state.auth.user);

  return (
    <StyledBoard>
      {readBoardState.loading && <div>로딩중입니다. 잠시만 기다려주세요.</div>}
      {readBoardState.error && (
        <div>오류가 발생했습니다. 잠시 후 다시 시도해주세요.</div>
      )}
      {readBoardState.success && (
        <div className="post-list">
          {readBoardState.success.data.map((post) => (
            <div className="post-item" key={post.postId}>
              <NavLink to={`/board/${boardType}/post/${post.postId}`}>
                {post.title}
              </NavLink>
              <div className="post-info">
                <NavLink to={`/users/${post.writerNickname}`}>
                  {post.writerNickname}
                </NavLink>
                <div className="post-createdAt">{getDate(post.createdAt)}</div>
              </div>
            </div>
          ))}
          {user && (
            <NavLink
              to={`/board/${boardType}/post/write`}
              className="post-write"
            >
              글 쓰기
            </NavLink>
          )}
        </div>
      )}
    </StyledBoard>
  );
};

export default BoardPresenter;

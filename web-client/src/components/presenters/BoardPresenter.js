import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StyledBoard = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
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
        <>
          <p>목록</p>
          {readBoardState.success.data.map((post) => (
            <NavLink
              to={`/board/${boardType}/post/${post.postId}`}
              key={post.postId}
            >
              {post.title}
            </NavLink>
          ))}
          {user && (
            <NavLink to={`/board/${boardType}/post/write`}>글 쓰기</NavLink>
          )}
        </>
      )}
    </StyledBoard>
  );
};

export default BoardPresenter;

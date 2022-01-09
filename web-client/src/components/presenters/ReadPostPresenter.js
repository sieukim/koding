import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  GetDate,
  MyPageLink,
  PrintState,
  Viewer,
} from '../../utils/MyComponents';

const StyledReadPost = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .post-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: lightgray;
    padding: 10px;
    margin: auto 0;
  }

  .post-info {
    display: flex;
    flex-direction: row;
  }

  .post-title {
    font-weight: bold;
    margin-right: 5px;
  }

  .post-createdAt {
    color: gray;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: end;

    button {
      margin: 0 5px;
    }
  }

  button {
    margin: 5px 0;
  }
`;

const ReadPostPresenter = ({
  readPostState,
  removePostState,
  onClickRemove,
  onClickEdit,
  onClickList,
}) => {
  // 로그인 유저 정보
  const user = useSelector((state) => state.auth.user);

  // 게시글 정보: writer, markdownContent, title, createdAt
  const writer = readPostState.success?.data?.writer;
  const markdownContent = readPostState.success?.data?.markdownContent;
  const title = readPostState.success?.data?.title;
  const createdAt = readPostState.success?.data?.createdAt;

  /* Viewer */

  const viewerRef = useRef();

  useEffect(() => {
    viewerRef.current &&
      viewerRef.current.getInstance().setMarkdown(markdownContent);
  }, [viewerRef, markdownContent]);

  return (
    <StyledReadPost>
      <PrintState state={readPostState} />
      {readPostState.success && (
        <>
          <div className="post-header">
            <div className="post-info">
              <div className="post-title">{title}</div>
              <MyPageLink
                nickname={writer.nickname}
                str={`by ${writer.nickname}`}
              />
            </div>
            <GetDate date={createdAt} className="post-createdAt" />
          </div>
          <Viewer innerRef={viewerRef} markdownContent={markdownContent} />
          {user && user.nickname === writer.nickname && (
            <div className="buttons">
              <button onClick={onClickEdit}>수정</button>
              <button onClick={onClickRemove}>삭제</button>
              <PrintState state={removePostState} />
            </div>
          )}
          <button onClick={onClickList}>목록</button>
        </>
      )}
    </StyledReadPost>
  );
};

export default ReadPostPresenter;

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { GetDate } from '../../../utils/GetDate';
import { NicknameLink } from '../utils/link/NicknameLink';
import { Chip } from '@material-ui/core';
import { Viewer } from '../utils/editor/Viewer';
import { PostLink } from '../utils/link/PostLink';

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

  .nav-buttons {
    text-align: center;
  }

  .nav-button {
    margin: 5px;
  }

  .disabled {
    pointer-events: none;
    cursor: default;
    color: gray;
  }
`;

const PostPresenter = ({
  readPostState,
  removePostState,
  onClickRemove,
  onClickEdit,
  onClickList,
  onClickTag,
  post = {},
  prevPostInfo = {},
  nextPostInfo = {},
}) => {
  // 로그인 유저 정보
  const user = useSelector((state) => state.auth.user);

  // 게시글 정보: writer, markdownContent, title, createdAt
  const {
    writerNickname = '',
    markdownContent = '',
    title = '',
    createdAt = '',
    readCount = 0,
    tags = [],
  } = post;

  // 이전 글 정보
  const { boardType: prevBoardType = '', postId: prevPostId = '' } =
    prevPostInfo;

  // 다음 글 정보
  const { boardType: nextBoardType = '', postId: nextPostId = '' } =
    nextPostInfo;

  /* Viewer */

  const viewerRef = useRef();

  useEffect(() => {
    viewerRef.current &&
      viewerRef.current.getInstance().setMarkdown(markdownContent);
  }, [viewerRef, markdownContent]);

  return (
    <StyledReadPost>
      <div className="post-header">
        <div className="post-info">
          <div className="post-title">{title}</div>
          <NicknameLink nickname={writerNickname} str={writerNickname} />
        </div>
        <GetDate date={createdAt} className="post-createdAt" />
      </div>
      <Viewer
        innerRef={viewerRef}
        markdownContent={markdownContent}
        className="post-content"
      />
      <div className="tag-container">
        {tags.map((tag) => {
          return (
            <Chip
              variant="outlined"
              label={tag}
              key={tag}
              size="small"
              onClick={onClickTag}
              data-tag={tag}
            />
          );
        })}
      </div>
      {user && user.nickname === writerNickname && (
        <div className="buttons">
          <button onClick={onClickEdit}>수정</button>
          <button onClick={onClickRemove}>삭제</button>
        </div>
      )}
      <div className="nav-buttons">
        <button className="nav-button" disabled={!prevPostId}>
          <PostLink
            boardType={prevBoardType}
            postId={prevPostId}
            postTitle="이전 글"
            className={prevPostId || 'disabled'}
          />
        </button>
        <button className="nav-button" onClick={onClickList}>
          목록
        </button>
        <button className="nav-button" disabled={!nextPostId}>
          <PostLink
            boardType={nextBoardType}
            postId={nextPostId}
            postTitle="다음 글"
            className={nextPostId || 'disabled'}
          />
        </button>
      </div>
    </StyledReadPost>
  );
};

export default PostPresenter;

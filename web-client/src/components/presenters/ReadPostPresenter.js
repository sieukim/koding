import styled from 'styled-components';
import { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { getDate } from '../../utils/getDate';
// viewer
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';
// codeSyntaxHighlight
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
// uml
import uml from '@toast-ui/editor-plugin-uml';
// table-merged-cell
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
// chart
import chart from '@toast-ui/editor-plugin-chart';

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
  boardType,
  readPostState,
  removePost,
  removePostState,
}) => {
  // 로그인 유저 정보
  const user = useSelector((state) => state.auth.user);

  /* 게시글 정보 가져오기 */

  // writer, postId, markdownContent
  const writer = readPostState.success?.data?.writer;
  const postId = readPostState.success?.data?.postId;
  const markdownContent = readPostState.success?.data?.markdownContent;

  /* Viewer */

  const viewerRef = useRef();

  useEffect(() => {
    viewerRef.current &&
      viewerRef.current.getInstance().setMarkdown(markdownContent);
  }, [viewerRef, markdownContent]);

  /* button event listener */

  const navigate = useNavigate();

  // 게시글 삭제
  const onClickRemove = useCallback(() => {
    removePost(boardType, postId);
  }, [removePost, boardType, postId]);

  // 게시글 수정
  const onClickEdit = useCallback(() => {
    navigate(`/board/${boardType}/post/${postId}/edit`);
  }, [boardType, postId, navigate]);

  // 목록으로 이동
  const onClickList = useCallback(() => {
    navigate(`/board/${boardType}`);
  }, [boardType, navigate]);

  return (
    <StyledReadPost>
      {readPostState.loading && <div>로딩중입니다. 잠시만 기다려주세요.</div>}
      {readPostState.error && (
        <div>오류가 발생했습니다. 잠시 후 다시 시도해주세요.</div>
      )}
      {readPostState.success && (
        <>
          <div className="post-header">
            <div className="post-info">
              <div className="post-title">
                {readPostState.success.data.title}
              </div>
              <NavLink
                to={`/users/${readPostState.success.data.writer.nickname}`}
              >
                by {readPostState.success.data.writer.nickname}
              </NavLink>
            </div>
            <div className="post-createdAt">
              {getDate(readPostState.success.data.createdAt)}
            </div>
          </div>
          <Viewer
            ref={viewerRef}
            initialValue={markdownContent}
            plugins={[
              [codeSyntaxHighlight, { highlighter: Prism }],
              uml,
              tableMergedCell,
              chart,
            ]}
          />
          {user && user.email === writer.email && (
            <div className="buttons">
              <button onClick={onClickEdit}>수정</button>
              <button onClick={onClickRemove}>삭제</button>
              {removePostState.error && (
                <div>오류가 발생했습니다. 잠시 후 다시 시도해주세요.</div>
              )}
            </div>
          )}
          <button onClick={onClickList}>목록</button>
        </>
      )}
    </StyledReadPost>
  );
};

export default ReadPostPresenter;

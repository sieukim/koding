import BoardPresenter from '../../presenters/post/BoardPresenter';
import useAsync from '../../../hooks/useAsync';
import * as api from '../../../modules/api';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const BoardContainer = ({ boardType, cursor, tags }) => {
  /* 게시글 목록 가져오기 */

  // 현재 게시글 목록 가져오기
  const [readBoardState] = useAsync(
    () => api.readBoard(boardType, tags, cursor),
    [boardType, tags, cursor],
    false,
  );

  const navigate = useNavigate();

  // 다음 게시글 목록
  const nextPageCursor = readBoardState.success?.data?.nextPageCursor;

  // 다음 게시글 목록으로 이동 이벤트 리스너
  const onClickNextCursor = useCallback(() => {
    const query = new URLSearchParams();
    if (tags && tags.length > 0) query.set('tags', tags);
    if (nextPageCursor) query.set('cursor', nextPageCursor);
    navigate(`/board/${boardType}?${query.toString()}`);
  }, [navigate, boardType, nextPageCursor, tags]);

  // 이전 게시글 목록
  const prevPageCursor = readBoardState.success?.data?.prevPageCursor;

  // 이전 게시글 목록으로 이동 이벤트 리스너
  const onClickPrevCursor = useCallback(() => {
    const query = new URLSearchParams();
    if (tags && tags.length > 0) query.set('tags', tags);
    if (prevPageCursor) query.set('cursor', prevPageCursor);
    navigate(`/board/${boardType}?${query.toString()}`);
  }, [navigate, boardType, prevPageCursor, tags]);

  // 글쓰기 이벤트 리스너
  const onClickWritePost = useCallback(() => {
    navigate(`/board/${boardType}/post/write`);
  }, [navigate, boardType]);

  // 태그 변화 리스너
  const onChangeTag = useCallback(
    (e, value) => {
      if (value.length === 0) {
        navigate(`/board/${boardType}`);
      } else {
        navigate(`/board/${boardType}?tags=${value.join(',')}`);
      }
    },
    [navigate],
  );

  /* 태그 목록 조회 */
  const [getTagListState] = useAsync(
    () => api.getTagList(boardType),
    [boardType],
    false,
  );

  return (
    <BoardPresenter
      boardType={boardType}
      readBoardState={readBoardState}
      hasNextPage={nextPageCursor}
      hasPrevPage={prevPageCursor}
      onClickNextCursor={onClickNextCursor}
      onClickPrevCursor={onClickPrevCursor}
      onClickWritePost={onClickWritePost}
      onChangeTag={onChangeTag}
      tagList={getTagListState.success?.data}
      posts={readBoardState.success?.data?.posts}
    />
  );
};

export default BoardContainer;

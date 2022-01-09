import BoardPresenter from '../presenters/BoardPresenter';
import useAsync from '../../hooks/useAsync';
import * as api from '../../modules/api';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const BoardContainer = ({ boardType, cursor }) => {
  /* 게시글 목록 가져오기 */

  // 현재 게시글 목록 가져오기
  const [readBoardState] = useAsync(
    () => api.readBoard(boardType, cursor),
    [boardType, cursor],
    false,
  );

  const navigate = useNavigate();

  // 다음 게시글 목록
  const nextPageCursor = readBoardState.success?.data?.nextPageCursor;

  // 다음 게시글 목록으로 이동 이벤트 리스너
  const onClickNextCursor = useCallback(() => {
    navigate(`/board/${boardType}?cursor=${nextPageCursor}`);
  }, [navigate, boardType, nextPageCursor]);

  // 이전 게시글 목록
  const prevPageCursor = readBoardState.success?.data?.prevPageCursor;

  // 이전 게시글 목록으로 이동 이벤트 리스너
  const onClickPrevCursor = useCallback(() => {
    navigate(`/board/${boardType}?cursor=${prevPageCursor}`);
  }, [navigate, boardType, prevPageCursor]);

  // 글쓰기 이벤트 리스너
  const onClickWritePost = useCallback(() => {
    navigate(`/board/${boardType}/post/write`);
  }, [navigate, boardType]);

  return (
    <BoardPresenter
      boardType={boardType}
      readBoardState={readBoardState}
      hasNextPage={nextPageCursor}
      hasPrevPage={prevPageCursor}
      onClickNextCursor={onClickNextCursor}
      onClickPrevCursor={onClickPrevCursor}
      onClickWritePost={onClickWritePost}
    />
  );
};

export default BoardContainer;

import BoardPresenter from '../presenters/BoardPresenter';
import useAsync from '../../hooks/useAsync';
import * as api from '../../modules/api';

const BoardContainer = ({ boardType }) => {
  /* 게시글 목록 가져오기 */

  const [readBoardState] = useAsync(
    () => api.readBoard(boardType),
    [boardType],
    false,
  );

  return (
    <BoardPresenter boardType={boardType} readBoardState={readBoardState} />
  );
};

export default BoardContainer;

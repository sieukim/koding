import BoardContainer from '../../components/containers/board/BoardContainer';
import { useLocation, useParams } from 'react-router-dom';
import { StyledBody } from '../../components/presenters/styled/StyledBody';

const emptyArr = [];

const BoardPage = () => {
  const params = useParams();
  const boardType = params.boardType;

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const query = searchParams.get('query');
  const tags = searchParams.get('tags')?.split(',');
  const sort = searchParams.get('sort');

  return (
    <StyledBody>
      <BoardContainer
        boardType={boardType}
        queryParams={query}
        tagsParams={tags ?? emptyArr}
        sortParams={sort}
      />
    </StyledBody>
  );
};

export default BoardPage;

import BoardContainer from '../../components/containers/board/BoardContainer';
import { useLocation, useParams } from 'react-router-dom';
import { StyledBody } from '../../components/presenters/styled/StyledBody';

const BoardPage = () => {
  const params = useParams();
  const boardType = params.boardType;

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const tags = searchParams.get('tags')?.split(',') ?? [];

  return (
    <StyledBody>
      <BoardContainer boardType={boardType} tagsParams={tags} />
    </StyledBody>
  );
};

export default BoardPage;

import BoardContainer from '../../components/containers/post/BoardContainer';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';

const StyledPage = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
`;

const BoardPage = () => {
  const params = useParams();
  const boardType = params.boardType;

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const tags = searchParams.get('tags')?.split(',') ?? [];

  return (
    <StyledPage>
      <BoardContainer boardType={boardType} tagsParams={tags} />
    </StyledPage>
  );
};

export default BoardPage;

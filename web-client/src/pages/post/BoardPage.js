import BoardContainer from '../../components/containers/post/BoardContainer';
import { useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';

const StyledBoard = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 60%;
`;

const BoardPage = () => {
  const params = useParams();
  const boardType = params.boardType;

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const cursor = searchParams.get('cursor');
  const tags = searchParams.get('tags');

  return (
    <StyledBoard>
      <BoardContainer boardType={boardType} cursor={cursor} tags={tags} />
    </StyledBoard>
  );
};

export default BoardPage;

import BoardContainer from '../../components/containers/board/BoardContainer';
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
  const cursor = new URLSearchParams(search).get('cursor');

  return (
    <StyledBoard>
      <BoardContainer boardType={boardType} cursor={cursor} />
    </StyledBoard>
  );
};

export default BoardPage;

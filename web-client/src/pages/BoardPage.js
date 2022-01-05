import BoardContainer from '../components/containers/BoardContainer';
import { useParams } from 'react-router-dom';
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

  return (
    <StyledBoard>
      <BoardContainer boardType={boardType} />
    </StyledBoard>
  );
};

export default BoardPage;

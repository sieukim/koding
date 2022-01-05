import WritePostContainer from '../components/containers/WritePostContainer';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const StyledWritePost = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 60%;
`;

const WritePostPage = () => {
  const params = useParams();
  const boardType = params.boardType;

  return (
    <StyledWritePost>
      <WritePostContainer boardType={boardType} />
    </StyledWritePost>
  );
};

export default WritePostPage;

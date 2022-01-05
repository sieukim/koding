import ReadPostContainer from '../components/containers/ReadPostContainer';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const StyledReadPost = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 60%;
`;

const ReadPostPage = () => {
  const params = useParams();
  const boardType = params.boardType;
  const postId = params.postId;

  return (
    <StyledReadPost>
      <ReadPostContainer boardType={boardType} postId={postId} />
    </StyledReadPost>
  );
};

export default ReadPostPage;

import ReadPostContainer from '../components/containers/ReadPostContainer';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import CommentContainer from '../components/containers/CommentContainer';

const StyledPost = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  width: 60%;
`;

const PostPage = () => {
  const params = useParams();
  const boardType = params.boardType;
  const postId = params.postId;

  return (
    <StyledPost>
      <ReadPostContainer boardType={boardType} postId={postId} />
      <CommentContainer boardType={boardType} postId={postId} />
    </StyledPost>
  );
};

export default PostPage;

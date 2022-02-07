import PostContainer from '../../components/containers/post/PostContainer';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  width: 100%;
`;

const PostPage = () => {
  const params = useParams();
  const boardType = params.boardType;
  const postId = params.postId;

  return (
    <StyledPage>
      <PostContainer boardType={boardType} postId={postId} />
    </StyledPage>
  );
};

export default PostPage;

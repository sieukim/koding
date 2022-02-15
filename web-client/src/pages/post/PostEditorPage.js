import { useParams } from 'react-router-dom';
import PostEditorContainer from '../../components/containers/post/PostEditorContainer';
import { StyledBody } from '../../components/presenters/styled/StyledBody';

const PostEditorPage = () => {
  const params = useParams();
  const boardType = params.boardType;
  const postId = params.postId;

  return (
    <StyledBody>
      <PostEditorContainer boardType={boardType} postId={postId} />;
    </StyledBody>
  );
};

export default PostEditorPage;

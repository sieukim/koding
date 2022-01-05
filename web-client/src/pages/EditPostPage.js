import EditPostContainer from '../components/containers/EditPostContainer';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const StyledEdit = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 60%;
`;

const EditPostPage = () => {
  const params = useParams();
  const boardType = params.boardType;
  const postId = params.postId;

  return (
    <StyledEdit>
      <EditPostContainer boardType={boardType} postId={postId} />
    </StyledEdit>
  );
};

export default EditPostPage;

import styled from 'styled-components';
import { CommentList } from '../utils/post/CommentList';
import { CommentEditor } from '../utils/comment/CommentEditor';

const StyledComment = styled.div`
  border: 1px solid rgb(217, 217, 217);
  border-radius: 8px;
  margin-bottom: 50px;
  padding: 32px;
  width: 900px;

  .spinner {
    width: 100%;
    text-align: center;
  }
`;

const CommentPresenter = ({
  user,
  loading,
  comments,
  getComments,
  nextPageCursor,
  onClickWrite,
  onClickRemove,
  writeLoading,
}) => {
  return (
    <StyledComment>
      <CommentEditor
        user={user}
        loading={writeLoading}
        onClick={onClickWrite}
      />
      <CommentList
        user={user}
        loading={loading}
        comments={comments}
        next={getComments}
        hasMore={nextPageCursor}
        onClickLike={() => console.log('like')}
        onClickUnlike={() => console.log('unlike')}
        onClickRemove={onClickRemove}
      />
    </StyledComment>
  );
};

export default CommentPresenter;

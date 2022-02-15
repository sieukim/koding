import { CommentList } from '../utils/post/CommentList';
import { CommentEditor } from '../utils/post/CommentEditor';
import { StyledCommentContainer } from '../styled/post/StyledCommentContainer';

const CommentPresenter = ({
  user,
  loading,
  writeLoading,
  post,
  comments,
  getComments,
  writers,
  nextPageCursor,
  onClickWrite,
  onClickRemove,
  onClickLike,
  onClickUnlike,
}) => {
  return (
    <StyledCommentContainer>
      {user && (
        <CommentEditor
          user={user}
          loading={writeLoading}
          post={post}
          writers={writers}
          onClick={onClickWrite}
        />
      )}
      <CommentList
        user={user}
        loading={loading}
        comments={comments}
        next={getComments}
        hasMore={nextPageCursor}
        onClickLike={onClickLike}
        onClickUnlike={onClickUnlike}
        onClickRemove={onClickRemove}
      />
    </StyledCommentContainer>
  );
};

export default CommentPresenter;

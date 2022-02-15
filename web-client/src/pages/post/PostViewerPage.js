import PostViewerContainer from '../../components/containers/post/PostViewerContainer';
import { useParams } from 'react-router-dom';
import CommentContainer from '../../components/containers/post/CommentContainer';
import { useEffect, useState } from 'react';
import useAsync from '../../hooks/useAsync';
import * as api from '../../modules/api';
import { StyledBody } from '../../components/presenters/styled/StyledBody';
import NavContainer from '../../components/containers/post/NavContainer';

const PostViewerPage = () => {
  const params = useParams();
  const boardType = params.boardType;
  const postId = params.postId;

  // 게시글 상태
  const [post, setPost] = useState({});

  // 게시글 가져오기
  const [getPostState] = useAsync(
    () => api.readPost(boardType, postId),
    [boardType, postId],
    false,
  );

  useEffect(() => {
    if (getPostState.success) {
      setPost(getPostState.success.data.post);
    }
  }, [getPostState]);

  return (
    <StyledBody flexDirection="column">
      <PostViewerContainer
        loading={getPostState.loading}
        boardType={boardType}
        postId={postId}
        post={post}
        setPost={setPost}
      />
      <NavContainer getPostState={getPostState} post={post} />
      <CommentContainer
        boardType={boardType}
        postId={postId}
        post={post}
        setPost={setPost}
      />
    </StyledBody>
  );
};

export default PostViewerPage;

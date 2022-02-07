import PostContainer from '../../components/containers/post/PostContainer';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import CommentContainer from '../../components/containers/post/CommentContainer';
import { useEffect, useState } from 'react';
import useAsync from '../../hooks/useAsync';
import * as api from '../../modules/api';

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
    <StyledPage>
      <PostContainer
        boardType={boardType}
        postId={postId}
        post={post}
        setPost={setPost}
      />
      <CommentContainer
        boardType={boardType}
        postId={postId}
        setPost={setPost}
      />
    </StyledPage>
  );
};

export default PostPage;

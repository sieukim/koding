import PostContainer from '../../components/containers/post/PostContainer';
import styled from 'styled-components';
import { useLocation, useParams } from 'react-router-dom';
import CommentContainer from '../../components/containers/post/CommentContainer';
import { useState } from 'react';

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

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const cursor = searchParams.get('cursor');

  const [postSuccess, setPostSuccess] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  return (
    <StyledPost>
      <PostContainer
        boardType={boardType}
        postId={postId}
        setPostSuccess={setPostSuccess}
        success={postSuccess && commentSuccess}
      />
      <CommentContainer
        boardType={boardType}
        postId={postId}
        setCommentSuccess={setCommentSuccess}
        success={postSuccess && commentSuccess}
        cursor={cursor}
      />
    </StyledPost>
  );
};

export default PostPage;

import { useCallback, useEffect, useState } from 'react';
import * as api from '../../../modules/api';
import ActivityListPresenter from '../../presenters/profile/ActivityListPresenter';

const ActivityListContainer = ({ profileUser }) => {
  // 게시글
  const [posts, setPosts] = useState({
    community: [],
    qna: [],
    [`study-group`]: [],
    blog: [],
  });

  const [nextPostCursor, setNextPostCursor] = useState({
    community: null,
    qna: null,
    [`study-group`]: null,
    blog: null,
  });

  const getUserPosts = useCallback(
    async (boardType = 'community') => {
      const response = await api.getUserPosts(
        profileUser,
        boardType,
        nextPostCursor[boardType],
      );
      setPosts((posts) => ({
        ...posts,
        [boardType]: [...posts[boardType], ...response.data.posts],
      }));
      setNextPostCursor((nextPostCursors) => ({
        ...nextPostCursors,
        [boardType]: response.data.nextPageCursor,
      }));
    },
    [profileUser, nextPostCursor],
  );

  useEffect(() => {
    getUserPosts('community');
    getUserPosts('qna');
    getUserPosts('study-group');
    getUserPosts('blog');
    // eslint-disable-next-line
  }, []);

  // 댓글
  const [comments, setComments] = useState({
    community: [],
    qna: [],
    [`study-group`]: [],
    blog: [],
  });

  const [nextCommentCursor, setNextCommentCursor] = useState({
    community: null,
    qna: null,
    [`study-group`]: null,
    blog: null,
  });

  const getUserComments = useCallback(
    async (boardType = 'community') => {
      const response = await api.getUserComments(
        profileUser,
        boardType,
        nextCommentCursor[boardType],
      );
      setComments((comments) => ({
        ...comments,
        [boardType]: [...comments[boardType], ...response.data.comments],
      }));
      setNextCommentCursor((nextCommentCursor) => ({
        ...nextCommentCursor,
        [boardType]: response.data.nextPageCursor,
      }));
    },
    [profileUser, nextCommentCursor],
  );

  useEffect(() => {
    getUserComments('community');
    getUserComments('qna');
    getUserComments(`study-group`);
    getUserComments('blog');
    // eslint-disable-next-line
  }, []);

  return (
    <ActivityListPresenter
      profileUser={profileUser}
      posts={posts}
      getPosts={getUserPosts}
      nextPostCursor={nextPostCursor}
      comments={comments}
      getComments={getUserComments}
      nextCommentCursor={nextCommentCursor}
    />
  );
};

export default ActivityListContainer;

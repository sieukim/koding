import { useCallback, useEffect, useState } from 'react';
import * as api from '../../../modules/api';
import TabPresenter from '../../presenters/profile/TabPresenter';

const TabContainer = ({ profileUser }) => {
  // 게시글
  const [posts, setPosts] = useState({
    common: [],
    question: [],
    [`study-group`]: [],
    column: [],
  });

  const [nextPostCursor, setNextPostCursor] = useState({
    common: null,
    question: null,
    [`study-group`]: null,
    column: null,
  });

  const getUserPosts = useCallback(
    async (boardType = 'common') => {
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
    getUserPosts('common');
    getUserPosts('question');
    getUserPosts('study-group');
    getUserPosts('column');
  }, []);

  // 댓글
  const [comments, setComments] = useState({
    common: [],
    question: [],
    [`study-group`]: [],
    column: [],
  });

  const [nextCommentCursor, setNextCommentCursor] = useState({
    common: null,
    question: null,
    [`study-group`]: null,
    column: null,
  });

  const getUserComments = useCallback(
    async (boardType = 'common') => {
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
    getUserComments('common');
    getUserComments('question');
    getUserComments(`study-group`);
    getUserComments('column');
  }, []);

  return (
    <TabPresenter
      posts={posts}
      getPosts={getUserPosts}
      nextPostCursor={nextPostCursor}
      comments={comments}
      getComments={getUserComments}
      nextCommentCursor={nextCommentCursor}
    />
  );
};

export default TabContainer;

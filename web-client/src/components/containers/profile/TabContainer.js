import { Tabs } from 'antd';
import { CommentOutlined, FormOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import * as api from '../../../modules/api';
import TabPresenter from '../../presenters/profile/TabPresenter';

const { TabPane } = Tabs;

const TabContainer = ({ profileUser }) => {
  // 게시글
  const [posts, setPosts] = useState({
    common: [],
    question: [],
    career: [],
    column: [],
  });

  const [nextPostCursor, setNextPostCursor] = useState({
    common: null,
    question: null,
    career: null,
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
    getUserPosts('career');
    getUserPosts('column');
  }, []);

  // 댓글
  const [comments, setComments] = useState({
    common: [],
    question: [],
    career: [],
    column: [],
  });

  const [nextCommentCursor, setNextCommentCursor] = useState({
    common: null,
    question: null,
    career: null,
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
    getUserComments('career');
    getUserComments('column');
  }, []);
  return (
    <Tabs defaultActiveKey="post" centered size="large">
      <TabPane
        key="post"
        tab={
          <span>
            <FormOutlined />
            게시글
          </span>
        }
      >
        <TabPresenter
          type="post"
          items={posts}
          setItems={setPosts}
          getItems={getUserPosts}
          nextCursor={nextPostCursor}
          setNextCursor={setNextPostCursor}
        />
      </TabPane>
      <TabPane
        key="comment"
        tab={
          <span>
            <CommentOutlined />
            댓글
          </span>
        }
      >
        <TabPresenter
          type="comment"
          items={comments}
          setItems={setComments}
          nextCursor={nextCommentCursor}
          setNextCursor={setNextCommentCursor}
          getItems={getUserComments}
        />
      </TabPane>
    </Tabs>
  );
};

export default TabContainer;

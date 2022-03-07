import { Tabs } from 'antd';
import { CommentOutlined, FormOutlined, HomeOutlined } from '@ant-design/icons';
import { IconText } from '../utils/post/IconText';
import { StyledActivityList } from '../styled/profile/StyledActivityList';
import { PostActivityList } from '../utils/profile/PostActivityList';
import { CommentActivityList } from '../utils/profile/CommentActivityList';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const ActivityListPresenter = ({
  profileUser,
  posts,
  getPosts,
  nextPostCursor,
  comments,
  getComments,
  nextCommentCursor,
}) => {
  // navigate
  const navigate = useNavigate();

  const onTabClick = useCallback(
    (tab) => {
      if (tab === 'blog') navigate(`/blog/${profileUser}`);
    },
    [navigate, profileUser],
  );

  return (
    <StyledActivityList>
      <Tabs
        defaultActiveKey="post"
        centered
        size="large"
        onTabClick={onTabClick}
      >
        <Tabs.TabPane
          key="post"
          tab={<IconText icon={<FormOutlined />} text="게시글" />}
        >
          <PostActivityList
            profileUser={profileUser}
            posts={posts}
            next={getPosts}
            hasMore={nextPostCursor}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          key="comment"
          tab={<IconText icon={<CommentOutlined />} text="댓글" />}
        >
          <CommentActivityList
            comments={comments}
            next={getComments}
            hasMore={nextCommentCursor}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          key="blog"
          tab={<IconText icon={<HomeOutlined />} text="블로그" />}
        />
      </Tabs>
    </StyledActivityList>
  );
};

export default ActivityListPresenter;

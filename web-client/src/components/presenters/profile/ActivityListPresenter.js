import { Tabs } from 'antd';
import { CommentOutlined, FormOutlined } from '@ant-design/icons';
import { IconText } from '../utils/post/IconText';
import { StyledActivityList } from '../styled/profile/StyledActivityList';
import { PostActivityList } from '../utils/profile/PostActivityList';
import { CommentActivityList } from '../utils/profile/CommentActivityList';

const ActivityListPresenter = ({
  profileUser,
  posts,
  getPosts,
  nextPostCursor,
  comments,
  getComments,
  nextCommentCursor,
}) => {
  return (
    <StyledActivityList>
      <Tabs defaultActiveKey="post" centered size="large">
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
      </Tabs>
    </StyledActivityList>
  );
};

export default ActivityListPresenter;

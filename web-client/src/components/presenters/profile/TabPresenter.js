import styled from 'styled-components';
import { Collapse, Tabs } from 'antd';
import { CommentOutlined, FormOutlined } from '@ant-design/icons';
import { PostList } from '../utils/post/PostList';
import { CommentList } from '../utils/comment/CommentList';

const { Panel } = Collapse;

const StyledPostList = styled.div`
  width: 900px;
`;

const PostTab = ({ posts, next, hasMore }) => {
  return (
    <StyledPostList>
      <Collapse accordion className="collapse" ghost>
        <Panel header="커뮤니티" key="common">
          <PostList
            posts={posts.common}
            next={next.common}
            hasMore={hasMore.common}
          />
        </Panel>
        <Panel header="Q&A" key="question">
          <PostList
            posts={posts.question}
            next={next.question}
            hasMore={hasMore.question}
          />
        </Panel>
        <Panel header="스터디 모집" key="study-group">
          <PostList
            posts={posts[`study-group`]}
            next={next[`study-group`]}
            hasMore={hasMore[`study-group`]}
          />
        </Panel>
      </Collapse>
    </StyledPostList>
  );
};

const CommentTab = ({ comments, next, hasMore }) => {
  return (
    <StyledPostList>
      <Collapse accordion className="collapse" ghost>
        <Panel header="커뮤니티" key="common">
          <CommentList
            comments={comments.common}
            next={next.common}
            hasMore={hasMore.common}
          />
        </Panel>
        <Panel header="Q&A" key="question">
          <CommentList
            comments={comments.question}
            next={next.question}
            hasMore={hasMore.question}
          />
        </Panel>
        <Panel header="스터디 모집" key="study-group">
          <CommentList
            comments={comments[`study-group`]}
            next={next[`study-group`]}
            hasMore={hasMore[`study-group`]}
          />
        </Panel>
      </Collapse>
    </StyledPostList>
  );
};

const TabPresenter = ({
  posts,
  getPosts,
  nextPostCursor,
  comments,
  getComments,
  nextCommentCursor,
}) => {
  return (
    <Tabs defaultActiveKey="post" centered size="large">
      <Tabs.TabPane
        key="post"
        tab={
          <span>
            <FormOutlined />
            게시글
          </span>
        }
      >
        <PostTab posts={posts} next={getPosts} hasMore={nextPostCursor} />
      </Tabs.TabPane>
      <Tabs.TabPane
        key="comment"
        tab={
          <span>
            <CommentOutlined />
            댓글
          </span>
        }
      >
        <CommentTab
          comments={comments}
          next={getComments}
          hasMore={nextCommentCursor}
        />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default TabPresenter;

import { Collapse } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PostList } from '../board/PostList';

export const PostActivityList = ({ profileUser, posts, next, hasMore }) => {
  return (
    <div className="post-activity-container">
      <Collapse accordion className="collapse" ghost>
        <Collapse.Panel header="커뮤니티" key="community">
          <InfiniteScroll
            dataLength={posts.community.length}
            next={next.community}
            hasMore={hasMore.community}
            loader={null}
          >
            <PostList posts={posts.community} profileUser={profileUser} />
          </InfiniteScroll>
        </Collapse.Panel>
        <Collapse.Panel header="Q&A" key="qna">
          <InfiniteScroll
            dataLength={posts.qna.length}
            next={next.qna}
            hasMore={hasMore.qna}
            loader={null}
          >
            <PostList posts={posts.qna} profileUser={profileUser} />
          </InfiniteScroll>
        </Collapse.Panel>
        <Collapse.Panel header="스터디 모집" key="study-group">
          <InfiniteScroll
            dataLength={posts[`study-group`].length}
            next={next[`study-group`]}
            hasMore={hasMore[`study-group`]}
            loader={null}
          >
            <PostList posts={posts[`study-group`]} profileUser={profileUser} />
          </InfiniteScroll>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

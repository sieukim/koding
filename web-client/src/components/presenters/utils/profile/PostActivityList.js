import { Collapse } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PostList } from '../board/PostList';

export const PostActivityList = ({ posts, next, hasMore }) => {
  return (
    <div className="post-activity-container">
      <Collapse accordion className="collapse" ghost>
        <Collapse.Panel header="커뮤니티" key="common">
          <InfiniteScroll
            dataLength={posts.common.length}
            next={next.common}
            hasMore={hasMore.common}
            loader={null}
          >
            <PostList posts={posts.common} />
          </InfiniteScroll>
        </Collapse.Panel>
        <Collapse.Panel header="Q&A" key="question">
          <InfiniteScroll
            dataLength={posts.question.length}
            next={next.question}
            hasMore={hasMore.question}
            loader={null}
          >
            <PostList posts={posts.question} />
          </InfiniteScroll>
        </Collapse.Panel>
        <Collapse.Panel header="스터디 모집" key="study-group">
          <InfiniteScroll
            dataLength={posts[`study-group`].length}
            next={next[`study-group`]}
            hasMore={hasMore[`study-group`]}
            loader={null}
          >
            <PostList posts={posts[`study-group`]} />
          </InfiniteScroll>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

import InfiniteScroll from 'react-infinite-scroll-component';
import { PostList } from './PostList';
import styled from 'styled-components';

const StyledPostList = styled.div`
  min-height: 50vh;
`;

export const InfiniteScrollPostList = ({ loading, posts, next, hasMore }) => {
  return (
    <StyledPostList>
      <InfiniteScroll next={next} hasMore={hasMore} dataLength={posts.length}>
        <PostList loading={loading} posts={posts} />
      </InfiniteScroll>
    </StyledPostList>
  );
};

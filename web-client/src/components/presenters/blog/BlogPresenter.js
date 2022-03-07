import InfiniteScroll from 'react-infinite-scroll-component';
import { StyledBlogPage } from '../styled/blog/StyledBlogPage';
import { PostList } from '../utils/board/PostList';
import { Divider, Spin } from 'antd';
import { BlogInfo } from '../utils/blog/BlogInfo';

const BlogPresenter = ({
  profileUser,
  loginUser,
  loading,
  posts,
  nextPageCursor,
  getBlogPost,
  onClickWrite,
}) => {
  return (
    <StyledBlogPage>
      <BlogInfo
        profileUser={profileUser}
        loginUser={loginUser}
        onClickWrite={onClickWrite}
      />
      <Divider />
      {loading ? (
        <Spin className="spinner" />
      ) : (
        <InfiniteScroll
          next={getBlogPost}
          hasMore={nextPageCursor}
          loader={null}
          dataLength={posts.length}
        >
          <PostList posts={posts} profileUser={profileUser} />
        </InfiniteScroll>
      )}
    </StyledBlogPage>
  );
};

export default BlogPresenter;

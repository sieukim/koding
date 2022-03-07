import { StyledCollectionPage } from '../styled/profile/StyledCollectionPage';
import { Tabs } from 'antd';
import { IconText } from '../utils/post/IconText';
import { LikeOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PostList } from '../utils/board/PostList';

const CollectionPresenter = ({
  loading,
  posts,
  nextPageCursor,
  getFollowingPosts,
}) => {
  return (
    <StyledCollectionPage>
      <Tabs defaultActiveKey="followings" centered size="large">
        <Tabs.TabPane
          key="followings"
          tab={<IconText icon={<UserOutlined />} text="팔로잉" />}
        >
          <InfiniteScroll
            next={getFollowingPosts}
            hasMore={nextPageCursor.followings}
            loader={null}
            dataLength={posts.followings.length}
          >
            <PostList loading={loading.followings} posts={posts.followings} />
          </InfiniteScroll>
        </Tabs.TabPane>
        <Tabs.TabPane
          key="liked"
          tab={<IconText icon={<LikeOutlined />} text="좋아요" />}
        >
          <PostList loading={loading.like} posts={posts.like} />
        </Tabs.TabPane>
        <Tabs.TabPane
          key="scrapped"
          tab={<IconText icon={<StarOutlined />} text="스크랩" />}
        >
          <PostList loading={loading.scrap} posts={posts.scrap} />
        </Tabs.TabPane>
      </Tabs>
    </StyledCollectionPage>
  );
};

export default CollectionPresenter;

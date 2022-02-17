import { Card, List, Spin } from 'antd';
import { NavLink } from 'react-router-dom';
import { PostList } from '../board/PostList';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AvatarLink } from '../link/AvatarLink';
import { NicknameLink } from '../link/NicknameLink';

export const ResultCard = ({
  type,
  title,
  boardType,
  query,
  posts,
  next,
  hasMore,
  data,
}) => {
  const searchQuery = new URLSearchParams();

  if (query) searchQuery.set('query', query);

  if (type === 'post') {
    return (
      <Card
        title={title}
        extra={
          <NavLink to={`/board/${boardType}?${searchQuery.toString()}`}>
            더 보기
          </NavLink>
        }
        className="result-card"
      >
        <PostList posts={posts} />
      </Card>
    );
  } else {
    return (
      <Card title="사용자" className="result-card">
        <InfiniteScroll
          next={next}
          hasMore={hasMore}
          loader={<Spin className="spinner" />}
          dataLength={data?.length}
        >
          <List
            dataSource={data}
            renderItem={(user) => (
              <List.Item key={user.nickname}>
                <List.Item.Meta
                  avatar={<AvatarLink nickname={user.nickname} />}
                  title={<NicknameLink nickname={user.nickname} />}
                />
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </Card>
    );
  }
};

import { Button, Divider } from 'antd';
import { SearchByTags } from '../utils/board/SearchByTags';
import { BoardMent } from '../utils/board/BoardMent';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PostList } from '../utils/board/PostList';
import { StyledBoardPage } from '../styled/board/StyledBoardPage';
import { SearchByQuery } from '../utils/board/SearchByQuery';

const BoardPresenter = ({
  loading,
  boardType,
  posts,
  getPosts,
  nextPageCursor,
  onClickWrite,
  tagsParams,
  tagsList,
}) => {
  return (
    <StyledBoardPage>
      <BoardMent boardType={boardType} />
      <div className="board-header">
        <SearchByQuery />
        {boardType !== 'recruit' && (
          <Button type="primary" onClick={onClickWrite} className="button">
            게시글 작성
          </Button>
        )}
      </div>
      <SearchByTags
        boardType={boardType}
        tagsParams={tagsParams}
        tagsList={tagsList}
      />
      <Divider />
      <InfiniteScroll
        loading={loading}
        next={getPosts}
        loader={null}
        hasMore={nextPageCursor}
        dataLength={posts.length}
        className="post-list"
      >
        <PostList loading={loading} posts={posts} />
      </InfiniteScroll>
    </StyledBoardPage>
  );
};

export default BoardPresenter;

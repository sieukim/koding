import { Button, Divider } from 'antd';
import { SearchByTags } from '../utils/board/SearchByTags';
import { BoardMent } from '../utils/board/BoardMent';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PostList } from '../utils/board/PostList';
import { StyledBoardPage } from '../styled/board/StyledBoardPage';
import { SearchByQuery } from '../utils/board/SearchByQuery';
import SearchBySort from '../utils/board/SearchBySort';

const BoardPresenter = ({
  loading,
  boardType,
  posts,
  getPosts,
  nextPageCursor,
  onClickWrite,
  queryParams,
  tagsParams,
  sortParams,
  tagsList,
}) => {
  const queries = new URLSearchParams();

  if (queryParams) queries.set('query', queryParams);
  if (tagsParams && tagsParams.length > 0) queries.set('tags', tagsParams);
  if (sortParams) queries.set('sort', sortParams);

  return (
    <StyledBoardPage>
      <BoardMent boardType={boardType} />
      <div className="board-action">
        <SearchByQuery boardType={boardType} queries={queries} />
        {boardType !== 'recruit' && (
          <Button
            type="primary"
            onClick={onClickWrite}
            className="button button-write"
          >
            게시글 작성
          </Button>
        )}
      </div>
      <SearchByTags
        boardType={boardType}
        queries={queries}
        tagsParams={tagsParams}
        tagsList={tagsList}
      />
      {!loading && (
        <SearchBySort
          boardType={boardType}
          queries={queries}
          sortParams={sortParams}
        />
      )}
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

import SearchPresenter from '../../presenters/search/SearchPresenter';
import useAsync from '../../../hooks/useAsync';
import * as api from '../../../modules/api';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchContainer = ({ boardType, cursor, query }) => {
  // 검색 api 호출
  const [searchState] = useAsync(
    () => api.search(boardType, cursor, query),
    [boardType, cursor, query],
    false,
  );

  const navigate = useNavigate();

  // 이전 검색 목록
  const prevPageCursor = searchState.success?.data?.prevPageCursor;

  // 이전 검색 목록 이동 이벤트 리스너
  const onClickPrevCursor = useCallback(() => {
    const queries = new URLSearchParams();
    if (prevPageCursor) queries.set('cursor', prevPageCursor);
    queries.set('query', query);
    navigate(`/search/${boardType}?${queries}`);
  }, [prevPageCursor, query, boardType]);

  // 다음 검색 목록
  const nextPageCursor = searchState.success?.data?.nextPageCursor;

  // 다음 검색 목록 이동 이벤트 리스너
  const onClickNextCursor = useCallback(() => {
    const queries = new URLSearchParams();
    if (nextPageCursor) queries.set('cursor', nextPageCursor);
    queries.set('query', query);
    navigate(`/search/${boardType}?${queries}`);
  }, [nextPageCursor, query, boardType]);

  return (
    <SearchPresenter
      boardType={boardType}
      searchResults={searchState.success?.data ?? { posts: [] }}
      hasPrevPage={prevPageCursor || prevPageCursor === ''}
      hasNextPage={nextPageCursor}
      onClickPrevCursor={onClickPrevCursor}
      onClickNextCursor={onClickNextCursor}
    />
  );
};

export default SearchContainer;

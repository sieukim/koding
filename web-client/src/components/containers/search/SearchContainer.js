import SearchPresenter from '../../presenters/search/SearchPresenter';
import * as api from '../../../modules/api';
import useAsync from '../../../hooks/useAsync';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchContainer = ({ query }) => {
  const navigate = useNavigate();

  // 통합 검색
  const [posts, setPosts] = useState({});
  const [searchState] = useAsync(() => api.search(query), [query], false);

  useEffect(() => {
    if (searchState.success) {
      setPosts(searchState.success.data);
    }
  }, [searchState]);

  // 유저 검색
  const [users, setUsers] = useState([]);
  const [nextPageCursor, setNextPageCursor] = useState(null);

  const getUsers = useCallback(async () => {
    const response = await api.searchUser(nextPageCursor, query);
    setUsers((users) => [...users, ...response.data.users]);
    setNextPageCursor(response.data.nextPageCursor);
  }, [nextPageCursor, query]);

  useEffect(() => {
    if (query) {
      getUsers();
    }

    return () => {
      setUsers([]);
      setNextPageCursor(null);
    };
    // eslint-disable-next-line
  }, [query]);

  const onClickSearch = useCallback(
    (query) => {
      if (query) {
        navigate(`/search?query=${query}`);
      }
    },
    [navigate],
  );

  return (
    <SearchPresenter
      query={query}
      onClickSearch={onClickSearch}
      column={posts.column}
      common={posts.common}
      question={posts.question}
      recruit={posts.recruit}
      studyGroup={posts[`study-group`]}
      users={users}
      getUsers={getUsers}
      nextPageCursor={nextPageCursor}
    />
  );
};

export default SearchContainer;

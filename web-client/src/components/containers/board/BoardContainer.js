import BoardPresenter from '../../presenters/board/BoardPresenter';
import * as api from '../../../modules/api';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useAsync from '../../../hooks/useAsync';

const BoardContainer = ({ boardType, queryParams, tagsParams, sortParams }) => {
  // 로그인 유저 정보
  const user = useSelector((state) => state.auth.user);
  // navigate
  const navigate = useNavigate();

  // 게시글 목록 loading 상태
  const [loading, setLoading] = useState(false);

  // 게시글 목록
  const [posts, setPosts] = useState([]);

  const [nextPageCursor, setNextPageCursor] = useState(null);

  const getPosts = useCallback(async () => {
    if (!nextPageCursor) setLoading(true);

    const response = await api.readBoard(
      boardType,
      nextPageCursor,
      queryParams,
      tagsParams,
      sortParams,
    );

    setPosts((posts) => [...posts, ...response.data.posts]);
    setNextPageCursor(response.data.nextPageCursor);
    setLoading(false);
  }, [boardType, nextPageCursor, queryParams, tagsParams, sortParams]);

  useEffect(() => {
    return () => {
      setLoading(false);
      setPosts([]);
      setNextPageCursor(null);
    };
    // eslint-disable-next-line
  }, [boardType, queryParams, tagsParams, sortParams]);

  useEffect(() => {
    if (nextPageCursor === null) getPosts();
    // eslint-disable-next-line
  }, [boardType, queryParams, tagsParams, sortParams, nextPageCursor]);

  // 게시글 작성 버튼 onClick 핸들러
  const onClickWrite = useCallback(() => {
    if (user) {
      navigate(`/board/${boardType}/write`);
    } else {
      navigate(`/login`);
    }
  }, [user, navigate, boardType]);

  // 게시판 내 존재하는 태그 배열 조회
  const [getTagsListState] = useAsync(
    async () => {
      const response = await api.getTagList(boardType);
      return response.data.map((value) => ({ label: value, value: value }));
    },
    [boardType],
    false,
  );

  return (
    <BoardPresenter
      user={user}
      loading={loading}
      boardType={boardType}
      posts={posts}
      getPosts={getPosts}
      nextPageCursor={nextPageCursor}
      onClickWrite={onClickWrite}
      queryParams={queryParams}
      tagsParams={tagsParams}
      sortParams={sortParams}
      tagsList={getTagsListState.success ?? []}
    />
  );
};

export default BoardContainer;

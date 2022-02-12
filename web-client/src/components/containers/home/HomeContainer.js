import HomePresenter from '../../presenters/home/HomePresenter';
import * as api from '../../../modules/api';
import { useCallback, useEffect, useState } from 'react';

const HomeContainer = () => {
  const [posts, setPosts] = useState({
    common: [],
    question: [],
    recruit: [],
    column: [],
  });

  // 일일 랭킹 조회
  const getRanking = useCallback(async (boardType) => {
    const response = await api.getRanking(boardType);
    setPosts((posts) => ({
      ...posts,
      [boardType]: [...posts[boardType], ...response.data.posts],
    }));
  }, []);

  useEffect(() => {
    getRanking('common');
    getRanking('question');
    getRanking('recruit');
    getRanking('column');
    // eslint-disable-next-line
  }, []);

  return <HomePresenter posts={posts} />;
};

export default HomeContainer;

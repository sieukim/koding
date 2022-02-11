import HomePresenter from '../presenters/HomePresenter';
import * as api from '../../modules/api';
import { useCallback, useEffect, useState } from 'react';

const HomeContainer = () => {
  const [posts, setPosts] = useState({});

  // 일일 랭킹 조회
  const getRanking = useCallback(async (boardType) => {
    const response = await api.getRanking(boardType);
    setPosts((posts) => ({ ...posts, [boardType]: response.data }));
  }, []);

  useEffect(() => {
    getRanking('common');
    getRanking('question');
    getRanking('recruit');
    getRanking('study-group');
    getRanking('column');
  }, [getRanking]);

  return <HomePresenter posts={posts} />;
};

export default HomeContainer;

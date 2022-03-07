import CollectionPresenter from '../../presenters/profile/CollectionPresenter';
import { useCallback, useEffect, useState } from 'react';
import * as api from '../../../modules/api';

const CollectionContainer = ({ profileUser }) => {
  // 로딩 상태
  const [loading, setLoading] = useState({
    followings: false,
    scrap: false,
    like: false,
  });
  // 게시글
  const [posts, setPosts] = useState({ followings: [], scrap: [], like: [] });
  // 페이지 커서
  const [nextPageCursor, setNextPageCursor] = useState({
    followings: null,
    scrap: null,
    like: null,
  });

  // 팔로잉하는 유저의 게시글 모아보기
  const getFollowingPosts = useCallback(async () => {
    if (!nextPageCursor.followings)
      setLoading((loading) => ({ ...loading, followings: true }));

    const response = await api.getFollowingPosts(
      profileUser,
      nextPageCursor.followings,
    );

    setPosts((posts) => ({
      ...posts,
      followings: [...posts.followings, ...response.data.posts],
    }));

    setNextPageCursor((nextPageCursor) => ({
      ...nextPageCursor,
      followings: response.data.nextPageCursor,
    }));

    setLoading((loading) => ({ ...loading, followings: false }));
  }, [profileUser, nextPageCursor]);

  // 스크랩한 게시글 모아보기
  const getScrappedPosts = useCallback(async () => {
    setLoading((loading) => ({ ...loading, scrap: true }));

    const response = await api.getScrappedPosts(profileUser);

    setPosts((posts) => ({
      ...posts,
      scrap: response.data.posts,
    }));

    setLoading((loading) => ({ ...loading, scrap: false }));
  }, [profileUser]);

  // 좋아요한 게시글 모아보기
  const getLikedPosts = useCallback(async () => {
    setLoading((loading) => ({ ...loading, like: true }));

    const response = await api.getLikedPosts(profileUser);

    setPosts((posts) => ({
      ...posts,
      like: response.data.posts,
    }));

    setLoading((loading) => ({ ...loading, like: false }));
  }, [profileUser]);

  useEffect(() => {
    if (nextPageCursor.followings === null) getFollowingPosts();
    getScrappedPosts();
    getLikedPosts();
    // eslint-disable-next-line
  }, [nextPageCursor]);

  useEffect(() => {
    return () => {
      setLoading({
        followings: false,
        scrap: false,
        like: false,
      });
      setPosts({ followings: [], scrap: [], like: [] });
      setNextPageCursor({
        followings: null,
        scrap: null,
        like: null,
      });
    };
    // eslint-disable-next-line
  }, [profileUser]);

  return (
    <CollectionPresenter
      loading={loading}
      posts={posts}
      nextPageCursor={nextPageCursor}
      getFollowingPosts={getFollowingPosts}
    />
  );
};

export default CollectionContainer;

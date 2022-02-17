import FollowListPresenter from '../../presenters/profile/FollowListPresenter';
import * as api from '../../../modules/api';
import useAsync from '../../../hooks/useAsync';
import { useSelector } from 'react-redux';
import { useMessage } from '../../../hooks/useMessage';
import { useCallback, useEffect, useState } from 'react';

const FollowListContainer = ({ profileUser, type }) => {
  // 로그인 유저 정보
  const loginUser = useSelector((state) => state.auth.user).nickname;

  // 프로필 유저 팔로워 리스트 조회
  const [getFollowerState] = useAsync(
    async () => {
      const response = await api.getFollower(profileUser);
      return response.data.followers.map((follower) => follower.nickname);
    },
    [profileUser],
    false,
  );

  // 프로필 유저 팔로잉 리스트 조회
  const [getFollowingState] = useAsync(
    async () => {
      const response = await api.getFollowing(profileUser);
      return response.data.followings.map((following) => following.nickname);
    },
    [profileUser],
    false,
  );

  // 로그인 유저 팔로잉 리스트 조회
  const [getLoginUserFollowingState] = useAsync(
    async () => {
      const response = await api.getFollowing(loginUser);
      return response.data.followings.map((following) => following.nickname);
    },
    [loginUser],
    false,
  );

  const [loginUserFollowings, setLoginUserFollowings] = useState([]);

  useEffect(() => {
    if (getLoginUserFollowingState.success) {
      setLoginUserFollowings(getLoginUserFollowingState.success);
    }
  }, [getLoginUserFollowingState]);

  // 팔로우
  const [followState, followFetch] = useAsync(
    async (nickname) => {
      await api.follow(loginUser, nickname);
      return nickname;
    },
    [loginUser],
    true,
  );

  const onClickFollow = useCallback(
    async (e) => {
      const targetNickname = e.currentTarget.dataset.nickname;
      await followFetch(targetNickname);
      setLoginUserFollowings((state) => [...state, targetNickname]);
    },
    [followFetch],
  );

  // message
  useMessage(followState, (state) => `${state.success}님을 팔로우했습니다.`);

  // 언팔로우
  const [unfollowState, unfollowFetch] = useAsync(
    async (nickname) => {
      await api.unfollow(loginUser, nickname);
      return nickname;
    },
    [loginUser],
    true,
  );

  // 언팔로우 버튼 onClick 핸들러
  const onClickUnfollow = useCallback(
    async (e) => {
      const targetNickname = e.currentTarget.dataset.nickname;
      await unfollowFetch(targetNickname);
      setLoginUserFollowings((state) =>
        state.filter((nickname) => nickname !== targetNickname),
      );
    },
    [unfollowFetch],
  );

  // message
  useMessage(
    unfollowState,
    (state) => `${state.success}님을 언팔로우했습니다.`,
  );

  return (
    <FollowListPresenter
      type={type}
      profileUser={profileUser}
      profileUserFollowers={getFollowerState.success ?? []}
      profileUserFollowings={getFollowingState.success ?? []}
      loginUser={loginUser}
      loginUserFollowings={loginUserFollowings}
      onClickFollow={onClickFollow}
      onClickUnfollow={onClickUnfollow}
    />
  );
};

export default FollowListContainer;

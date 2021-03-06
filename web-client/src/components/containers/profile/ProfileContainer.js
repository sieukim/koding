import ProfilePresenter from '../../presenters/profile/ProfilePresenter';
import * as api from '../../../modules/api';
import useAsync from '../../../hooks/useAsync';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMessage } from '../../../hooks/useMessage';

const ProfileContainer = ({ profileUser }) => {
  // 로그인 유저
  const loginUser = useSelector((state) => state.auth.user);

  // 팔로우, 팔로잉 유저 수
  const [followersCount, setFollowersCount] = useState(0);
  const [followingsCount, setFollowingsCount] = useState(0);

  // 프로필 유저
  const [getUserState] = useAsync(
    () => api.getUser(profileUser),
    [profileUser],
    false,
  );

  useEffect(() => {
    if (getUserState.success) {
      setFollowingsCount(getUserState.success.data.followingsCount);
      setFollowersCount(getUserState.success.data.followersCount);
    }
  }, [getUserState]);

  // 팔로우
  const [followState, followFetch] = useAsync(
    async (loginUserNickname, followedUserNickname) => {
      const response = await api.follow(
        loginUserNickname,
        followedUserNickname,
      );
      setFollowersCount((followersCount) => followersCount + 1);
      return response;
    },
    [],
    true,
  );

  const onClickFollow = useCallback(
    async () => await followFetch(loginUser.nickname, profileUser),
    [followFetch, loginUser, profileUser],
  );

  // message
  useMessage(followState, `${profileUser}님을 팔로우했습니다.`);

  // 언팔로우
  const [unfollowState, unfollowFetch] = useAsync(
    async (loginUserNickname, unfollowedUserNickname) => {
      const response = await api.unfollow(
        loginUserNickname,
        unfollowedUserNickname,
      );
      setFollowersCount((followersCount) => followersCount - 1);
      return response;
    },
    [],
    true,
  );

  const onClickUnfollow = useCallback(
    async () => await unfollowFetch(loginUser.nickname, profileUser),
    [unfollowFetch, loginUser, profileUser],
  );

  // message
  useMessage(unfollowState, `${profileUser}님을 언팔로우했습니다.`);

  // 팔로우 여부 조회
  const [isFollowingState] = useAsync(
    async () => {
      if (loginUser && loginUser.nickname !== profileUser) {
        return api.isFollowing(loginUser.nickname, profileUser);
      }
    },
    [loginUser, profileUser, followersCount, followingsCount],
    false,
  );

  return (
    <ProfilePresenter
      loginUser={loginUser}
      profileUser={getUserState.success?.data ?? {}}
      getUserLoading={getUserState.loading}
      followLoading={followState.loading}
      unfollowLoading={unfollowState.loading}
      onClickFollow={onClickFollow}
      onClickUnfollow={onClickUnfollow}
      isFollowingState={isFollowingState}
      followersCount={followersCount}
      followingsCount={followingsCount}
    />
  );
};

export default ProfileContainer;

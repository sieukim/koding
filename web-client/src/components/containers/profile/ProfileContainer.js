import ProfilePresenter from '../../presenters/profile/ProfilePresenter';
import * as api from '../../../modules/api';
import useAsync from '../../../hooks/useAsync';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMessage } from '../../../hooks/useMessage';

const ProfileContainer = ({ profileUser }) => {
  // 로그인 유저
  const loginUser = useSelector((state) => state.auth.user);

  // 팔로우, 팔로잉 유저 리스트
  const [followers, setFollowers] = useState();
  const [followings, setFollowings] = useState();

  // 프로필 유저
  const [getUserState] = useAsync(
    () => api.getUser(profileUser),
    [profileUser],
    false,
  );

  useEffect(() => {
    if (getUserState.success) {
      setFollowings(getUserState.success.data.followingsCount);
      setFollowers(getUserState.success.data.followersCount);
    }
  }, [getUserState.success]);

  // 팔로우
  const [followState, followFetch] = useAsync(
    async (loginUserNickname, followedUserNickname) => {
      const response = await api.follow(
        loginUserNickname,
        followedUserNickname,
      );
      setFollowers((followerNumber) => followerNumber + 1);
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
      setFollowers((followerNumber) => followerNumber - 1);
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

  // 팔로잉 조회
  const [getFollowingState] = useAsync(
    () => api.getFollowing(profileUser),
    [profileUser],
    false,
  );

  // 팔로워 조회
  const [getFollowerState] = useAsync(
    () => api.getFollower(profileUser),
    [profileUser],
    false,
  );

  // 팔로우 여부 조회
  const [isFollowingState] = useAsync(
    async () => {
      if (loginUser && loginUser.nickname !== profileUser) {
        return api.isFollowing(loginUser.nickname, profileUser);
      }
    },
    [loginUser, profileUser, followers, followings],
    false,
  );

  useEffect(() => {
    if (getFollowingState.success) {
      setFollowings(getFollowingState.success.data.count);
    }
    if (getFollowerState.success) {
      setFollowers(getFollowerState.success.data.count);
    }
  }, [getFollowingState.success, getFollowerState.success]);

  return (
    <ProfilePresenter
      loginUser={loginUser}
      profileUser={profileUser}
      getUserData={getUserState.success?.data}
      followState={followState}
      onClickFollow={onClickFollow}
      unfollowState={unfollowState}
      onClickUnfollow={onClickUnfollow}
      isFollowingState={isFollowingState}
      followers={followers}
      followings={followings}
    />
  );
};

export default ProfileContainer;

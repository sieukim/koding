import ProfilePresenter from '../../presenters/profile/ProfilePresenter';
import * as api from '../../../modules/api';
import useAsync from '../../../hooks/useAsync';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ProfileContainer = ({ profileUserNickname }) => {
  const loginUser = useSelector((state) => state.auth.user);

  const [followers, setFollowers] = useState(0);
  const [followings, setFollowings] = useState(0);

  /* 팔로우 */
  // 팔로우 버튼
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

  const follow = useCallback(
    async (loginUserNickname, followedUserNickname) =>
      await followFetch(loginUserNickname, followedUserNickname),
    [followFetch],
  );

  // 언팔로우 버튼
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

  const unfollow = useCallback(
    async (loginUserNickname, unfollowedUserNickname) =>
      await unfollowFetch(loginUserNickname, unfollowedUserNickname),
    [unfollowFetch],
  );

  // 팔로잉 조회
  const [getFollowingState] = useAsync(
    () => api.getFollowing(profileUserNickname),
    [profileUserNickname],
    false,
  );

  // 팔로워 조회
  const [getFollowerState] = useAsync(
    () => api.getFollower(profileUserNickname),
    [profileUserNickname],
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
      profileUserNickname={profileUserNickname}
      followState={followState}
      follow={follow}
      unfollowState={unfollowState}
      unfollow={unfollow}
      followers={followers}
      followings={followings}
    />
  );
};

export default ProfileContainer;

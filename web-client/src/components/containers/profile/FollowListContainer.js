import FollowListPresenter from '../../presenters/profile/FollowListPresenter';
import * as api from '../../../modules/api';
import useAsync from '../../../hooks/useAsync';
import { useSelector } from 'react-redux';

const FollowListContainer = ({ profileUser, tab }) => {
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

  // 로그인 유저 정보
  const loginUser = useSelector((state) => state.auth.user).nickname;

  // 로그인 유저 팔로잉 리스트 조회
  const [getLoginUserFollowingState] = useAsync(
    async () => {
      const response = await api.getFollowing(loginUser);
      return response.data.followings.map((following) => following.nickname);
    },
    [loginUser],
    false,
  );

  // 팔로우
  const [followState, followFetch, initializeFollowState] = useAsync(
    async (nickname) => {
      await api.follow(loginUser, nickname);
      return nickname;
    },
    [loginUser],
    true,
  );

  // 언팔로우
  const [unfollowState, unfollowFetch, initializeUnfollowState] = useAsync(
    async (nickname) => {
      await api.unfollow(loginUser, nickname);
      return nickname;
    },
    [loginUser],
    true,
  );

  return (
    <FollowListPresenter
      tab={tab}
      profileUser={profileUser}
      profileUserFollowers={getFollowerState.success ?? []}
      profileUserFollowings={getFollowingState.success ?? []}
      loginUser={loginUser}
      loginUserFollowings={getLoginUserFollowingState.success ?? []}
      followState={followState}
      followFetch={followFetch}
      unfollowState={unfollowState}
      unfollowFetch={unfollowFetch}
      initializeFollowState={initializeFollowState}
      initializeUnfollowState={initializeUnfollowState}
    />
  );
};

export default FollowListContainer;

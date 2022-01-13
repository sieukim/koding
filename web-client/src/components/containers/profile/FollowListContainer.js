import FollowListPresenter from '../../presenters/profile/FollowListPresenter';
import * as api from '../../../modules/api';
import useAsync from '../../../hooks/useAsync';

const FollowListContainer = ({ profileNickname, type }) => {
  /* 팔로우 리스트 조회 */
  // 팔로워
  const [getFollowerState] = useAsync(
    async () => await api.getFollower(profileNickname),
    [profileNickname],
    false,
  );

  // 팔로잉
  const [getFollowingState] = useAsync(
    async () => await api.getFollowing(profileNickname),
    [profileNickname],
    false,
  );

  return (
    <FollowListPresenter
      getFollowingState={getFollowingState}
      getFollowerState={getFollowerState}
      type={type}
    />
  );
};

export default FollowListContainer;

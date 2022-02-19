import { FollowListLink } from '../link/FollowListLink';

export const FollowItem = (props) => {
  const { nickname, followersCount, followingsCount, className } = props;

  return (
    <div className={className}>
      <div>
        팔로워 &nbsp;
        <FollowListLink
          nickname={nickname}
          number={followersCount}
          type="follower"
        />
      </div>
      <div>
        팔로우 &nbsp;
        <FollowListLink
          nickname={nickname}
          number={followingsCount}
          type="following"
        />
      </div>
    </div>
  );
};

import { Button } from 'antd';

export const ButtonItem = (props) => {
  const {
    profileUser,
    loginUser,
    isFollowingState,
    followLoading,
    unfollowLoading,
    onClickFollow,
    onClickUnfollow,
    className,
  } = props;

  if (loginUser && loginUser.nickname === profileUser.nickname) {
    return (
      <Button
        href={`/user/${loginUser.nickname}/profile/edit`}
        className={className}
      >
        프로필 편집
      </Button>
    );
  }

  if (loginUser && isFollowingState.success) {
    return (
      <Button
        loading={unfollowLoading}
        onClick={onClickUnfollow}
        className={className}
      >
        언팔로우
      </Button>
    );
  }

  if (loginUser && isFollowingState.error) {
    return (
      <Button
        loading={followLoading}
        onClick={onClickFollow}
        className={className}
      >
        팔로우
      </Button>
    );
  }

  if (loginUser) {
    return <Button>임시 버튼</Button>;
  }

  return null;
};

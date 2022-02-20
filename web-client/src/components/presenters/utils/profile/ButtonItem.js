import { Button } from 'antd';

export const ButtonItem = (props) => {
  const {
    profileUser,
    loginUser,
    isFollowingState,
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
      <Button onClick={onClickUnfollow} className={className}>
        언팔로우
      </Button>
    );
  }

  if (loginUser && isFollowingState.error) {
    return (
      <Button onClick={onClickFollow} className={className}>
        팔로우
      </Button>
    );
  }

  return null;
};

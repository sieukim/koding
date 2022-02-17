import styled from 'styled-components';

const StyledProfile = styled.div``;

const ProfilePresenter = ({
  loginUser,
  profileUser,
  getUserData = {},
  followState,
  onClickFollow,
  unfollowState,
  onClickUnfollow,
  isFollowingState,
  followers,
  followings,
  getUserPostFetch,
  posts,
  setPosts,
  hasNextPost,
  getUserPost,
}) => {
  return <StyledProfile>{loginUser.nickname}</StyledProfile>;
};

export default ProfilePresenter;

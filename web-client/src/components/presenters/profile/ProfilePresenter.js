import styled from 'styled-components';

const StyledProfile = styled.div``;

const ProfilePresenter = ({
  loginUser,
  profileUser,
  getUserData = {},
  followState,
  follow,
  unfollowState,
  unfollow,
  isFollowingState,
  followers,
  followings,
  getUserPostFetch,
  posts,
  setPosts,
  hasNextPost,
  getUserPost,
}) => {
  return <StyledProfile></StyledProfile>;
};

export default ProfilePresenter;

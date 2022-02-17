import { Tabs } from 'antd';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FollowList } from '../utils/profile/FollowList';
import { StyledFollowListPage } from '../styled/profile/StyledFollowListPage';

const { TabPane } = Tabs;

const FollowListPresenter = ({
  type,
  profileUser,
  profileUserFollowers,
  profileUserFollowings,
  loginUser,
  loginUserFollowings,
  onClickFollow,
  onClickUnfollow,
}) => {
  // navigate
  const navigate = useNavigate();

  // tab onClick 핸들러
  const onTabClick = useCallback(
    (tab) => {
      navigate(`/user/${profileUser}/profile/${tab}`);
    },
    [navigate, profileUser],
  );

  return (
    <StyledFollowListPage>
      <Tabs activeKey={type} centered size="large" onTabClick={onTabClick}>
        <TabPane tab="팔로워" key="follower">
          <FollowList
            list={profileUserFollowers}
            loginUser={loginUser}
            loginUserFollowings={loginUserFollowings}
            onClickFollow={onClickFollow}
            onClickUnfollow={onClickUnfollow}
          />
        </TabPane>
        <TabPane tab="팔로잉" key="following">
          <FollowList
            list={profileUserFollowings}
            loginUser={loginUser}
            loginUserFollowings={loginUserFollowings}
            onClickFollow={onClickFollow}
            onClickUnfollow={onClickUnfollow}
          />
        </TabPane>
      </Tabs>
    </StyledFollowListPage>
  );
};

export default FollowListPresenter;

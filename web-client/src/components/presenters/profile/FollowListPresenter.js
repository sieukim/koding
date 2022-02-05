import styled from 'styled-components';
import { NicknameLink } from '../utils/link/NicknameLink';
import { Button, List, Tabs } from 'antd';
import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { useMessage } from '../../../hooks/useMessage';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

const StyledFollowList = styled.div`
  .ant-tabs-nav {
    margin-bottom: 0;
  }
`;

const ListPresenter = ({
  list,
  loginUser,
  loginUserFollowingState,
  setLoginUserFollowingState,
  followState,
  followFetch,
  unfollowState,
  unfollowFetch,
}) => {
  // 팔로우 버튼 onClick 핸들러
  const onClickFollow = useCallback(
    async (e) => {
      const targetNickname = e.currentTarget.dataset.nickname;
      await followFetch(targetNickname);
      setLoginUserFollowingState((state) => [...state, targetNickname]);
    },
    [followFetch],
  );

  // 언팔로우 버튼 onClick 핸들러
  const onClickUnfollow = useCallback(
    async (e) => {
      const targetNickname = e.currentTarget.dataset.nickname;
      await unfollowFetch(targetNickname);
      setLoginUserFollowingState((state) =>
        state.filter((nickname) => nickname !== targetNickname),
      );
    },
    [unfollowFetch],
  );

  return (
    <List
      dataSource={list}
      renderItem={(user) => (
        <List.Item>
          <NicknameLink nickname={user} />
          {loginUser &&
            loginUser !== user &&
            (loginUserFollowingState.includes(user) ? (
              <Button
                icon={<UserDeleteOutlined />}
                data-nickname={user}
                onClick={onClickUnfollow}
              >
                언팔로우
              </Button>
            ) : (
              <Button
                icon={<UserAddOutlined />}
                data-nickname={user}
                onClick={onClickFollow}
              >
                팔로우
              </Button>
            ))}
        </List.Item>
      )}
    />
  );
};

const FollowListPresenter = ({
  tab,
  profileUser,
  profileUserFollowers,
  profileUserFollowings,
  loginUser,
  loginUserFollowings,
  followState,
  followFetch,
  unfollowState,
  unfollowFetch,
}) => {
  const navigate = useNavigate();

  // tab onClick 핸들러
  const onTabClick = useCallback(
    (tab) => {
      navigate(`/user/${profileUser}/profile/${tab}`);
    },
    [profileUser],
  );

  // 로그인 유저가 팔로우하는 유저 리스트
  const [loginUserFollowingState, setLoginUserFollowingState] = useState([]);

  useEffect(() => {
    setLoginUserFollowingState(loginUserFollowings);
  }, [loginUserFollowings]);

  useMessage(followState, (state) => `${state.success}님을 팔로우했습니다.`);

  useMessage(
    unfollowState,
    (state) => `${state.success}님을 언팔로우했습니다.`,
  );

  return (
    <StyledFollowList>
      <Tabs activeKey={tab} centered size="large" onTabClick={onTabClick}>
        <TabPane tab="팔로워" key="follower">
          <ListPresenter
            list={profileUserFollowers}
            loginUser={loginUser}
            loginUserFollowingState={loginUserFollowingState}
            setLoginUserFollowingState={setLoginUserFollowingState}
            followState={followState}
            followFetch={followFetch}
            unfollowState={unfollowState}
            unfollowFetch={unfollowFetch}
          />
        </TabPane>
        <TabPane tab="팔로잉" key="following">
          <ListPresenter
            list={profileUserFollowings}
            loginUser={loginUser}
            loginUserFollowingState={loginUserFollowingState}
            setLoginUserFollowingState={setLoginUserFollowingState}
            followState={followState}
            followFetch={followFetch}
            unfollowState={unfollowState}
            unfollowFetch={unfollowFetch}
          />
        </TabPane>
      </Tabs>
    </StyledFollowList>
  );
};

export default FollowListPresenter;

import styled from 'styled-components';
import { NavLink, useMatch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as api from '../modules/api';
import { useCallback, useEffect, useState } from 'react';
import { Avatar, Badge, Divider, Dropdown, Menu, message } from 'antd';
import { setLogout } from '../modules/auth';
import useAsync from '../hooks/useAsync';
import { BellFilled, UserOutlined } from '@ant-design/icons';

const StyledHeader = styled.nav`
  display: flex;
  flex-direction: row;
  padding: 16px 32px;
  justify-content: space-between;
  align-items: center;

  .web-title {
    font-size: 30px;
  }

  .ant-menu-horizontal {
    border-bottom: none;
  }

  li {
    margin: auto 30px;
    font-weight: bold;
    font-size: 1rem;
    color: grey;
  }

  .login {
    width: 88px;
    text-align: right;
    font-weight: bold;
    font-size: 1rem;
  }

  .icon-group {
    display: flex;
    flex-direction: row;
    align-items: center;

    a {
      display: flex;
      align-items: center;
      margin: 0 16px;

      .anticon-bell {
        color: grey;
      }
    }
  }
`;

const NavigationBar = () => {
  const [current, setCurrent] = useState(null);

  const match = useMatch('/board/:boardType/*');
  const boardType = match?.params?.boardType;

  useEffect(() => {
    if (boardType) {
      setCurrent(boardType);
    }
    if (!match) {
      setCurrent(null);
    }
  }, [boardType, match]);

  return (
    <Menu selectedKeys={[current]} mode="horizontal">
      <Menu.Item key="common">
        <NavLink to="/board/common">커뮤니티</NavLink>
      </Menu.Item>
      <Menu.Item key="question">
        <NavLink to="/board/question">Q&A</NavLink>
      </Menu.Item>
      <Menu.Item key="recruit">
        <NavLink to="/board/recruit">채용 정보</NavLink>
      </Menu.Item>
      <Menu.Item key="study-group">
        <NavLink to="/board/study-group">스터디 모집</NavLink>
      </Menu.Item>
      <Menu.Item key="column">
        <NavLink to="/board/column">블로그</NavLink>
      </Menu.Item>
    </Menu>
  );
};

const Notification = ({ loginUser }) => {
  // 안 읽은 알림 여부 확인
  const [checkNotificationState, checkNotificationFetch] = useAsync(
    () => api.checkNotifications(loginUser),
    [loginUser],
    false,
  );

  // 안 읽은 알림 여부 확인
  useEffect(() => {
    const timerId = setInterval(() => checkNotificationFetch(), 5000);
    return () => clearInterval(timerId);
  }, [checkNotificationFetch]);

  return (
    <NavLink to={`/user/${loginUser}/notification`}>
      <Badge dot={checkNotificationState.success}>
        <BellFilled style={{ fontSize: '24px' }} />
      </Badge>
    </NavLink>
  );
};

const UserDropdown = ({ loginUser, avatarUrl, logout }) => {
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key="profile">
            <NavLink to={`/user/${loginUser}/profile`}>내 프로필</NavLink>
          </Menu.Item>
          <Menu.Item key="edit-profile">
            <NavLink to={`/user/${loginUser}/profile/edit`}>
              프로필 편집
            </NavLink>
          </Menu.Item>
          <Menu.Item key="logout">
            <div onClick={logout}>로그아웃</div>
          </Menu.Item>
        </Menu>
      }
      placement="bottomRight"
    >
      {avatarUrl ? (
        <Avatar src={avatarUrl} />
      ) : (
        <Avatar icon={<UserOutlined />} />
      )}
    </Dropdown>
  );
};

const Header = () => {
  const user = useSelector((state) => state.auth.user);

  // 유저 정보 가져오기
  const [loginUserState] = useAsync(() => api.getLoginUser(), [], false);
  const loginUser = loginUserState.success?.data?.nickname;
  const avatarUrl = loginUserState.success?.data?.avatarUrl;

  // 로그아웃
  const dispatch = useDispatch();

  const logout = useCallback(async () => {
    try {
      const onSetLogout = () => dispatch(setLogout());
      await api.logout();
      onSetLogout();
      message.success('또 만나요! 👋');
    } catch (e) {
      message.error('오류가 발생했어요 😭 잠시 후 다시 시도해주세요!');
    }
  }, []);

  // 검색
  const match = useMatch('/search');

  return (
    <>
      <StyledHeader>
        <NavLink className="web-title" to="/">
          Koding
        </NavLink>
        {/*{!match && <SearchBar className="header" />}*/}
        <NavigationBar />
        {!user && (
          <NavLink to="/login" className="login">
            로그인
          </NavLink>
        )}
        {user && (
          <div className="icon-group">
            <Notification loginUser={user.nickname} />
            <UserDropdown
              loginUser={loginUser}
              avatarUrl={avatarUrl}
              logout={logout}
            />
          </div>
        )}
      </StyledHeader>
      <Divider style={{ margin: '0 0', padding: '0 16px' }} />
    </>
  );
};

export default Header;

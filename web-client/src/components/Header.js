import styled from 'styled-components';
import { NavLink, useMatch, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as api from '../modules/api';
import { useCallback, useEffect, useState } from 'react';
import { Avatar, Badge, Dropdown, Menu, message } from 'antd';
import { setLogout } from '../modules/auth';
import useAsync from '../hooks/useAsync';
import { BellFilled, SearchOutlined, UserOutlined } from '@ant-design/icons';

const StyledHeader = styled.nav`
  display: flex;
  flex-direction: row;
  padding: 16px 32px;
  justify-content: space-between;
  align-items: center;

  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

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

  .icon-groups {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: right;
    width: 176px;
    height: 32px;

    a {
      display: flex;
      align-items: center;
      margin-left: 32px;

      font-weight: bold;
      font-size: 1rem;

      .anticon-bell,
      .anticon-search {
        color: grey;
      }
    }

    .ant-dropdown-trigger {
      margin-left: 32px;
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
    const timerId = setInterval(() => checkNotificationFetch(), 10000);
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
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  // dropdown onClick 핸들러
  const onClickDropdown = useCallback((e) => {
    setVisible((visible) => !visible);
  }, []);

  // menu item onClick 핸들러
  const onClickMenu = useCallback(
    ({ key }) => {
      if (key === 'profile') navigate(`/user/${loginUser}/profile`);
      if (key === 'edit-profile') navigate(`/user/${loginUser}/profile/edit`);
      if (key === 'logout') logout();
      setVisible((visible) => !visible);
    },
    [navigate, loginUser, logout],
  );

  return (
    <Dropdown
      overlay={
        <Menu onClick={onClickMenu}>
          <Menu.Item key="profile">내 프로필</Menu.Item>
          <Menu.Item key="edit-profile">프로필 편집</Menu.Item>
          <Menu.Item key="logout">로그아웃</Menu.Item>
        </Menu>
      }
      placement="bottomRight"
      visible={visible}
      onClick={onClickDropdown}
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

  return (
    <StyledHeader>
      <NavLink className="web-title" to="/">
        Koding
      </NavLink>
      <NavigationBar />
      <div className="icon-groups">
        <NavLink to="/search">
          <SearchOutlined style={{ fontSize: '24px' }} />
        </NavLink>
        {user ? (
          <>
            <Notification loginUser={user.nickname} />
            <UserDropdown
              loginUser={user.nickname}
              avatarUrl={user.avatarUrl}
              logout={logout}
            />
          </>
        ) : (
          <NavLink to="/login">로그인</NavLink>
        )}
      </div>
    </StyledHeader>
  );
};

export default Header;

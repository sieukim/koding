import { NavLink, useMatch, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as api from '../modules/api';
import { useCallback, useEffect, useState } from 'react';
import { Avatar, Badge, Dropdown, Menu, message } from 'antd';
import { setLogout } from '../modules/auth';
import useAsync from '../hooks/useAsync';
import { BellFilled, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { StyledHeader } from './presenters/styled/StyledHeader';

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
      <Menu.Item key="community">
        <NavLink to="/board/community">커뮤니티</NavLink>
      </Menu.Item>
      <Menu.Item key="qna">
        <NavLink to="/board/qna">Q&A</NavLink>
      </Menu.Item>
      <Menu.Item key="recruit">
        <NavLink to="/board/recruit">채용 정보</NavLink>
      </Menu.Item>
      <Menu.Item key="study-group">
        <NavLink to="/board/study-group">스터디 모집</NavLink>
      </Menu.Item>
      <Menu.Item key="blog">
        <NavLink to="/board/blog">블로그</NavLink>
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
  const onClickDropdown = useCallback(() => {
    setVisible((visible) => !visible);
  }, []);

  // menu item onClick 핸들러
  const onClickMenu = useCallback(
    ({ key }) => {
      if (key === 'profile') navigate(`/user/${loginUser}/profile`);
      if (key === 'edit-profile') navigate(`/user/${loginUser}/profile/edit`);
      if (key === 'blog') navigate(`/blog/${loginUser}`);
      if (key === 'logout') logout();
      setVisible((visible) => !visible);
    },
    [navigate, loginUser, logout],
  );

  return (
    <Dropdown
      overlay={
        <Menu onClick={onClickMenu}>
          <Menu.Item key="blog">내 블로그</Menu.Item>
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
    // eslint-disable-next-line
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

import * as api from '../modules/api';
import useAsync from '../hooks/useAsync';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';

export const AvatarLink = (props) => {
  const { nickname, rest } = props;

  // 아바타 정보 가져오기
  const [getUserState] = useAsync(
    () => api.getUser(nickname),
    [nickname],
    false,
  );

  const avatarUrl = getUserState.success?.data?.avatarUrl;

  return (
    <NavLink to={`/user/${nickname}/profile`} {...rest}>
      {avatarUrl ? (
        <Avatar src={avatarUrl} />
      ) : (
        <Avatar icon={<UserOutlined />} />
      )}
    </NavLink>
  );
};

import useAsync from '../../../../hooks/useAsync';
import * as api from '../../../../modules/api';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export const AvatarItem = (props) => {
  const { nickname, className } = props;

  // 아바타 정보 가져오기
  const [getUserState] = useAsync(
    () => api.getUser(nickname),
    [nickname],
    false,
  );

  const avatarUrl = getUserState.success?.data?.avatarUrl;

  return (
    <div className={className}>
      {avatarUrl ? (
        <Avatar src={avatarUrl} size={200} />
      ) : (
        <Avatar icon={<UserOutlined />} size={200} />
      )}
    </div>
  );
};

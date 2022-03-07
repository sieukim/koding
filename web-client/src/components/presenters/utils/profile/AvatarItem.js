import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export const AvatarItem = (props) => {
  const { avatarUrl, className } = props;

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

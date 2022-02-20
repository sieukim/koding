import { IconText } from '../post/IconText';
import { MailOutlined, UserOutlined } from '@ant-design/icons';

export const UserInfoItem = (props) => {
  const { profileUser, className } = props;

  return (
    <div className={className}>
      <IconText icon={<UserOutlined />} text={profileUser.nickname} />
      <IconText icon={<MailOutlined />} text={profileUser.email} />
    </div>
  );
};

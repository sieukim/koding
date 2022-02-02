// 마이페이지로 가는 NavLink
import * as api from '../modules/api';
import useAsync from '../hooks/useAsync';
import { Avatar, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const StyledProfileLink = styled.div`
  .avatar,
  .link {
    padding: 0;
  }

  .link {
    margin-left: 10px;
    text-align: center;
  }
`;

export const ProfileLink = (props) => {
  const { nickname, str, rest } = props;

  // 아바타 정보 가져오기
  const [getUserSate] = useAsync(
    () => api.getUser(nickname),
    [nickname],
    false,
  );
  const avatarUrl = getUserSate.success?.data?.avatarUrl;

  return (
    <StyledProfileLink>
      {avatarUrl ? (
        <Avatar src={avatarUrl} className="avatar" />
      ) : (
        <Avatar icon={<UserOutlined />} className="avatar" />
      )}
      <Button type="link" href={`/user/${nickname}/profile`} className="link">
        {str ?? nickname}
      </Button>
    </StyledProfileLink>
  );
};

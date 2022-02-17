import { Button, List } from 'antd';
import { NicknameLink } from '../link/NicknameLink';
import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons';

export const FollowList = ({
  list,
  loginUser,
  loginUserFollowings,
  onClickFollow,
  onClickUnfollow,
}) => {
  return (
    <List
      dataSource={list}
      renderItem={(user) => (
        <List.Item className="follow-container">
          <NicknameLink nickname={user} />
          {loginUser &&
            loginUser !== user &&
            (loginUserFollowings.includes(user) ? (
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

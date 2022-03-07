import { EditOutlined } from '@ant-design/icons';
import { StyledTitle } from '../../styled/StyledTitle';
import { StyledBlogInfo } from '../../styled/blog/StyledBlogInfo';
import { Tooltip } from 'antd';

export const BlogInfo = ({ profileUser, loginUser, onClickWrite }) => {
  const writeIcon =
    loginUser && loginUser.nickname === profileUser ? (
      <Tooltip placement="bottom" title="게시글 작성">
        <EditOutlined
          style={{ fontSize: '20px', color: 'grey' }}
          onClick={onClickWrite}
        />
      </Tooltip>
    ) : null;

  return (
    <StyledBlogInfo>
      <StyledTitle>
        {profileUser}님의 블로그&nbsp;&nbsp;{writeIcon}
      </StyledTitle>
      <p>{profileUser}님이 관심있는 주제의 글을 작성하는 공간입니다. 📝</p>
    </StyledBlogInfo>
  );
};

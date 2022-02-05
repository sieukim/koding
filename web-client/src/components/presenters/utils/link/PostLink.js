import { NavLink } from 'react-router-dom';
import { Typography } from 'antd';
import markdownToTxt from 'markdown-to-txt';

export const PostLink = (props) => {
  const { boardType, postId, postTitle, markdownContent, ...rest } = props;

  if (postTitle) {
    return (
      <NavLink to={`/board/${boardType}/post/${postId}`} {...rest}>
        {postTitle}
      </NavLink>
    );
  } else {
    return (
      <NavLink to={`/board/${boardType}/post/${postId}`} {...rest}>
        <Typography.Paragraph ellipsis={{ rows: 3 }}>
          {markdownToTxt(markdownContent)}
        </Typography.Paragraph>
      </NavLink>
    );
  }
};

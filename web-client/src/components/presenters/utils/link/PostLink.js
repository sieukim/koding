import { NavLink } from 'react-router-dom';
import { Typography } from 'antd';
import { Viewer } from '../editor/Viewer';
import markdownToTxt from 'markdown-to-txt';
import { PictureOutlined } from '@ant-design/icons';

export const PostLink = (props) => {
  const { boardType, postId, postTitle, markdownContent, imageUrls, ...rest } =
    props;

  if (postTitle) {
    return (
      <NavLink to={`/board/${boardType}/${postId}`} {...rest}>
        {postTitle}
      </NavLink>
    );
  }

  if (markdownContent) {
    return (
      <NavLink to={`/board/${boardType}/${postId}`} {...rest}>
        <Typography.Paragraph ellipsis={{ rows: 3 }}>
          <Viewer
            markdownContent={markdownToTxt(markdownContent).replace(
              /alt_text/g,
              '',
            )}
          />
        </Typography.Paragraph>
      </NavLink>
    );
  }

  if (imageUrls) {
    if (imageUrls.length > 0) {
      return (
        <NavLink to={`/board/${boardType}/${postId}`} {...rest}>
          <img
            alt="logo"
            style={{ width: '150px', height: '150px', borderRadius: '10px' }}
            src={imageUrls[0]}
          />
        </NavLink>
      );
    } else {
      return (
        <NavLink to={`/board/${boardType}/${postId}`} {...rest}>
          <PictureOutlined style={{ fontSize: '150px', color: '#f5f5f5' }} />
        </NavLink>
      );
    }
  }

  return null;
};

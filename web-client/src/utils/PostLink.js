// 게시글로 가는 NavLink
import { NavLink } from 'react-router-dom';

export const PostLink = (props) => {
  const { boardType, postId, postTitle, ...rest } = props;
  return (
    <NavLink to={`/board/${boardType}/post/${postId}`} {...rest}>
      {postTitle}
    </NavLink>
  );
};

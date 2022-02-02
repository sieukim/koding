// 팔로우 리스트 NavLink
import { NavLink } from 'react-router-dom';

export const FollowListLink = (props) => {
  const { nickname, number, tab, ...rest } = props;
  return (
    <NavLink to={`/user/${nickname}/profile/${tab}`} {...rest}>
      {number}
    </NavLink>
  );
};

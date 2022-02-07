import { NavLink } from 'react-router-dom';

export const NicknameLink = (props) => {
  const { nickname, str, rest } = props;

  return nickname ? (
    <NavLink to={`/user/${nickname}/profile`} {...rest}>
      {str ?? nickname}
    </NavLink>
  ) : (
    '탈퇴한 사용자'
  );
};

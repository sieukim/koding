import { NavLink } from 'react-router-dom';

export const NicknameLink = (props) => {
  const { nickname, str, rest } = props;

  return (
    <NavLink to={`/user/${nickname}/profile`} {...rest}>
      {str ?? nickname}
    </NavLink>
  );
};

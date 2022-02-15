import GithubSignupContainer from '../../components/containers/auth/GithubSignupContainer.js';
import { StyledBody } from '../../components/presenters/styled/StyledBody';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { message } from 'antd';

const GithubSignupPage = () => {
  // 로그인 유저
  const user = useSelector((state) => state.auth.user);

  // navigate
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      message.warning('로그인 상태입니다.');
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <StyledBody>
      <GithubSignupContainer />
    </StyledBody>
  );
};

export default GithubSignupPage;

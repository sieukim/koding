import EmailLoginContainer from '../../components/containers/auth/EmailLoginContainer';
import { StyledBody } from '../../components/presenters/styled/StyledBody';
import { useSelector } from 'react-redux';
import { message } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmailLoginPage = () => {
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
      <EmailLoginContainer />
    </StyledBody>
  );
};

export default EmailLoginPage;

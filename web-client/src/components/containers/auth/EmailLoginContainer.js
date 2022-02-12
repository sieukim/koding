import EmailLoginPresenter from '../../presenters/auth/EmailLoginPresenter';
import * as api from '../../../modules/api';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../../modules/auth';
import useAsync from '../../../hooks/useAsync';
import { useMessage } from '../../../hooks/useMessage';

const EmailLoginContainer = () => {
  // navigate
  const navigate = useNavigate();
  // 로그인 전역 상태
  const dispatch = useDispatch();
  // eslint-disable-next-line
  const onSetLogin = useCallback((user) => dispatch(setLogin(user)), []);

  // 로그인 api
  const [loginState, loginFetch] = useAsync(
    (user) => api.login(user),
    [],
    true,
  );

  // 로그인 성공
  useEffect(() => {
    if (loginState.success) {
      const user = loginState.success.data;
      onSetLogin(user);
      navigate('/');
    }
  }, [loginState, onSetLogin, navigate]);

  // message
  useMessage(loginState, '오늘도 멋진 하루 보내세요 ✨');

  // github 로그인 url
  const githubLoginUrl = useMemo(() => {
    const CLIENT_ID = '855268489b238ce4aa0e';
    const REDIRECT_URL = 'http://localhost:3000/github/login';
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URL,
    });
    const scopes = ['read:user', 'user:email'];

    params.append('scope', scopes.join(' '));

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }, []);

  return (
    <EmailLoginPresenter
      loading={loginState.loading}
      onLogin={loginFetch}
      githubLoginUrl={githubLoginUrl}
    />
  );
};

export default EmailLoginContainer;

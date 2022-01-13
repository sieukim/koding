import LoginPresenter from '../../presenters/auth/LoginPresenter';
import * as api from '../../../modules/api';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../../modules/auth';
import useAsync from '../../../hooks/useAsync';

const LoginContainer = () => {
  /* 로그인 */

  // login state
  const [loginState, loginFetch] = useAsync(
    (user) => api.login(user),
    [],
    true,
  );

  const dispatch = useDispatch();
  const onSetLogin = useCallback(
    (user) => dispatch(setLogin(user)),
    [dispatch],
  );

  // 로그인 api 호출
  const login = useCallback(
    async (user) => {
      await loginFetch(user);
    },
    [loginFetch],
  );

  // login state에 저장된 user를 이용하여 로그인 상태로 변경
  useEffect(() => {
    if (loginState.success) {
      const user = loginState.success.data;
      onSetLogin(user);
    }
  }, [onSetLogin, loginState.success]);

  /* github callback */

  const url = useMemo(() => {
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

  const navigate = useNavigate();

  useEffect(() => {
    if (loginState.success) {
      navigate(-1);
    }
  }, [loginState.success, navigate]);

  return (
    <>
      <LoginPresenter login={login} loginState={loginState} url={url} />
    </>
  );
};

export default LoginContainer;

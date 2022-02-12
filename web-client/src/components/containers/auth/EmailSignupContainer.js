import { useCallback, useEffect, useState } from 'react';
import EmailSignupPresenter from '../../presenters/auth/EmailSignupPresenter';
import { useNavigate } from 'react-router-dom';
import * as api from '../../../modules/api';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../../modules/auth';
import useAsync from '../../../hooks/useAsync';
import { useMessage } from '../../../hooks/useMessage';

const EmailSignupContainer = () => {
  // navigate
  const navigate = useNavigate();

  // 로그인 전역상태
  const dispatch = useDispatch();
  // eslint-disable-next-line
  const onSetLogin = useCallback((user) => dispatch(setLogin(user)), []);

  // 중복 검사 api 호출 결과로 중복이면 true 값을 갖는다.
  const [duplicated, setDuplicated] = useState({
    email: true,
    nickname: true,
  });
  // 중복 검사 api 호출 결과로 검사를 하면 true 값을 갖는다.
  const [checked, setChecked] = useState({
    email: false,
    nickname: false,
  });

  // 중복검사
  const onDuplicateCheck = useCallback(async (key, value) => {
    try {
      await api.duplicateCheck(key, value);
      setDuplicated((duplicated) => ({
        ...duplicated,
        [key]: false,
      }));
    } catch (e) {
      setDuplicated((duplicated) => ({
        ...duplicated,
        [key]: true,
      }));
    } finally {
      setChecked((checked) => ({
        ...checked,
        [key]: true,
      }));
    }
  }, []);

  // 회원가입
  const [signupState, signupFetch] = useAsync(
    (user) => api.signup(user),
    [],
    true,
  );

  // 로그인
  const [loginState, loginFetch] = useAsync(
    (user) => api.login(user),
    [],
    true,
  );

  // 회원가입 핸들러
  const onSignup = useCallback(
    async (user) => {
      await signupFetch(user);
      await loginFetch(user);
    },
    [signupFetch, loginFetch],
  );

  // 회원가입 성공
  useEffect(() => {
    if (loginState.success) {
      const user = loginState.success.data;
      onSetLogin(user);
      navigate('/');
    }
  }, [loginState, onSetLogin, navigate]);

  // message
  useMessage(signupState, 'Hello World! 👻');

  return (
    <EmailSignupPresenter
      loading={signupState.loading}
      onSignup={onSignup}
      duplicated={duplicated}
      checked={checked}
      onDuplicateCheck={onDuplicateCheck}
    />
  );
};

export default EmailSignupContainer;

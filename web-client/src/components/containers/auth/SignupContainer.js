import { useCallback, useEffect, useState } from 'react';
import SignupPresenter from '../../presenters/auth/SignupPresenter';
import { Navigate } from 'react-router-dom';
import * as api from '../../../modules/api';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../../modules/auth';
import useAsync from '../../../hooks/useAsync';

const SignupContainer = () => {
  /* 중복 검사 */

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

  // 중복 검사 api 호출 함수
  const duplicateCheck = useCallback(async (key, value) => {
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

  /* 회원가입 */

  // signup state
  const [signupState, signupFetch] = useAsync(
    (user) => api.signup(user),
    [],
    true,
  );

  // login state
  const [loginState, loginFetch] = useAsync(
    (user) => api.login(user),
    [],
    true,
  );

  // signup api & login api 호출
  const signup = useCallback(
    async (user) => {
      await signupFetch(user);
      await loginFetch(user);
    },
    [signupFetch, loginFetch],
  );

  /* 로그인 */

  const dispatch = useDispatch();
  const onSetLogin = useCallback((user) => dispatch(setLogin(user)), []);

  // login state에 저장된 user를 이용하여 로그인 상태로 변경
  useEffect(() => {
    if (loginState.success) {
      const user = loginState.success.data;
      onSetLogin(user);
    }
  }, [onSetLogin, loginState.success]);

  return (
    <>
      {loginState.success && <Navigate to="/" />}
      <SignupPresenter
        signup={signup}
        signupState={signupState}
        duplicated={duplicated}
        checked={checked}
        duplicateCheck={duplicateCheck}
      />
    </>
  );
};

export default SignupContainer;

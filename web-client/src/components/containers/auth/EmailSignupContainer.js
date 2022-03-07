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

  // 인증 코드 발송
  const [sendState, sendFetch, initializeSendState] = useAsync(
    (email) => api.sendSignupToken(email),
    [],
    true,
  );

  // message
  useMessage(sendState, '인증코드가 발송되었어요! 확인해주세요 🔑');

  // 인증 코드 확인
  const [verifyState, verifyFetch, initializeVerifyState] = useAsync(
    (email, verifyToken) => api.verifySignupToken(email, verifyToken),
    [],
    true,
  );

  // message
  useMessage(
    verifyState,
    '인증번호가 확인되었어요! 회원가입을 진행해주세요 🔑',
  );

  // 토큰 전송 후 이메일 정보 바뀐 경우 정보 초기화
  const initializeState = useCallback(() => {
    initializeSendState();
    initializeVerifyState();
  }, [initializeSendState, initializeVerifyState]);

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
      sendLoading={sendState.loading}
      sendData={sendState.success}
      sendError={sendState.error}
      verifyLoading={verifyState.loading}
      verifyData={verifyState.success}
      verifyError={verifyState.error}
      onSendToken={sendFetch}
      onVerifyToken={verifyFetch}
      initializeState={initializeState}
    />
  );
};

export default EmailSignupContainer;

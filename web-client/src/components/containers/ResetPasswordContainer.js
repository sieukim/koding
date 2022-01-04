import ResetPasswordPresenter from '../presenters/ResetPasswordPresenter';
import * as api from '../../modules/api';
import { useCallback } from 'react';
import useAsync from '../../hooks/useAsync';

const ResetPasswordContainer = () => {
  /* 인증 코드 발송 */

  // send state
  const [sendState, sendFetch, initializeSendState] = useAsync(
    (user) => api.sendToken(user),
    [],
    true,
  );

  // 비밀번호 초기화 토큰 전송 요청 APi 호출 함수
  const sendToken = useCallback(
    async (user) => {
      await sendFetch(user);
    },
    [sendFetch],
  );

  /* 인증 코드 확인 */

  // verified state
  const [verifyState, verifyFetch, initializeVerifyState] = useAsync(
    (user) => api.verifyToken(user),
    [],
    true,
  );

  // 비밀코드 초기화 토큰 검증 api 호출 함수
  const verifyToken = useCallback(
    async (user) => {
      await verifyFetch(user);
    },
    [verifyFetch],
  );

  // 토큰 전송 후 이메일 정보 바뀌면 정보 초기화
  const initializeState = useCallback(() => {
    initializeSendState();
    initializeVerifyState();
  }, [initializeSendState, initializeVerifyState]);

  /* 비밀번호 초기화 */

  // reset state
  const [resetState, resetFetch] = useAsync(
    (user) => api.resetPassword(user),
    [],
    true,
  );

  // 비밀번호 초기화 api 호출
  const resetPassword = useCallback(
    async (user) => {
      await resetFetch(user);
    },
    [resetFetch],
  );

  return (
    <ResetPasswordPresenter
      sendToken={sendToken}
      sendState={sendState}
      verifyToken={verifyToken}
      verifyState={verifyState}
      resetPassword={resetPassword}
      resetState={resetState}
      initializeState={initializeState}
    />
  );
};

export default ResetPasswordContainer;

import ResetPasswordPresenter from '../../presenters/auth/ResetPasswordPresenter';
import * as api from '../../../modules/api';
import { useCallback } from 'react';
import useAsync from '../../../hooks/useAsync';
import { useMessage } from '../../../hooks/useMessage';

const ResetPasswordContainer = () => {
  // 인증 코드 발송
  const [sendState, sendFetch, initializeSendState] = useAsync(
    (user) => api.sendToken(user),
    [],
    true,
  );

  // message
  useMessage(sendState, '인증코드가 발송되었어요! 확인해주세요 🔑');

  // 인증 코드 확인
  const [verifyState, verifyFetch, initializeVerifyState] = useAsync(
    (user) => api.verifyToken(user),
    [],
    true,
  );

  // 토큰 전송 후 이메일 정보 바뀐 경우 정보 초기화
  const initializeState = useCallback(() => {
    initializeSendState();
    initializeVerifyState();
  }, [initializeSendState, initializeVerifyState]);

  // message
  useMessage(
    verifyState,
    '인증번호가 확인되었어요! 비밀번호 변경을 진행해주세요 🔑',
  );

  // 비밀번호 초기화
  const [resetState, resetFetch] = useAsync(
    (user) => api.resetPassword(user),
    [],
    true,
  );

  // message
  useMessage(resetState, '비밀번호를 변경했어요! 🔑');

  return (
    <ResetPasswordPresenter
      sendLoading={sendState.loading}
      sendData={sendState.success}
      sendError={sendState.error}
      verifyLoading={verifyState.loading}
      verifyData={verifyState.success}
      verifyError={verifyState.error}
      resetLoading={resetState.loading}
      onSendToken={sendFetch}
      onVerifyToken={verifyFetch}
      onResetPassword={resetFetch}
      initializeState={initializeState}
    />
  );
};

export default ResetPasswordContainer;

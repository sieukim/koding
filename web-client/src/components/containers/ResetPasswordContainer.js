import ResetPasswordPresenter from '../presenters/ResetPasswordPresenter';
import * as api from '../../modules/api';
import { useCallback, useState } from 'react';

const ResetPasswordContainer = () => {
  /* 인증 코드 발송 */

  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendFailure, setSendFailure] = useState(false);

  // 비밀번호 초기화 토큰 전송 요청 APi 호출 함수
  const sendToken = useCallback(async (user) => {
    try {
      await api.sendToken(user);
      setSendSuccess(true);
    } catch (e) {
      setSendFailure(true);
    }
  }, []);

  /* 인증 코드 확인 */

  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [verifiedFailure, setVerifiedFailure] = useState(false);

  // 비밀코드 초기화 토큰 검증 api 호출 함수
  const verifyToken = useCallback(async (user) => {
    try {
      await api.verifyToken(user);
      setVerifiedSuccess(true);
      setVerifiedFailure(false);
    } catch (e) {
      setVerifiedFailure(true);
      setVerifiedSuccess(true);
    }
  }, []);

  // 토큰 전송 후 이메일 정보 바뀌면 정보 초기화
  const resetInfo = useCallback((key) => {
    setSendSuccess(false);
    setSendFailure(false);
    setVerifiedSuccess(false);
    setVerifiedFailure(false);
  }, []);

  /* 비밀번호 초기화 */

  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetFailure, setResetFailure] = useState(false);
  const [loading, setLoading] = useState(false);

  // 비밀번호 초기화 api 호출
  const resetPassword = useCallback(async (user) => {
    setLoading(true);
    try {
      await api.resetPassword(user);
      setResetSuccess(true);
    } catch (e) {
      setResetFailure(true);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ResetPasswordPresenter
      sendToken={sendToken}
      resetInfo={resetInfo}
      verifyToken={verifyToken}
      resetPassword={resetPassword}
      sendSuccess={sendSuccess}
      sendFailure={sendFailure}
      verifiedSuccess={verifiedSuccess}
      verifiedFailure={verifiedFailure}
      resetSuccess={resetSuccess}
      resetFailure={resetFailure}
      loading={loading}
    />
  );
};

export default ResetPasswordContainer;

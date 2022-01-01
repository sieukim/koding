import { useCallback, useState } from 'react';
import SignupPresenter from '../presenters/SignupPresenter';
import { Navigate } from 'react-router-dom';
import * as api from '../../modules/api';

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

  // 중복 검사 후 입력값이 변하는 경우 checked와 duplicated 값을 초기화 => 중복검사 재활성화
  const resetCheck = useCallback((key) => {
    setDuplicated((duplicated) => ({
      ...duplicated,
      [key]: true,
    }));
    setChecked((checked) => ({
      ...checked,
      [key]: false,
    }));
  }, []);

  /* 회원가입 */

  // 회원가입 진행 중이면 true 값을 갖는다. => 회원가입 버튼을 비활성화함
  const [loading, setLoading] = useState(false);
  // 회원가입 api 호출 결과로 회원가입에 성공하면 true 값을 갖는다.
  const [success, setSuccess] = useState(false);
  // 회원가입 api 호출 결과로 회원가입에 실패하면 true 값을 갖는다.
  const [failure, setFailure] = useState(false);

  // 회원가입 api 호출 함수
  const signup = useCallback(async (user) => {
    setLoading(true);
    try {
      await api.signup(user);
      setSuccess(true);
    } catch (e) {
      setFailure(true);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {success && <Navigate to="/" />}
      <SignupPresenter
        signup={signup}
        loading={loading}
        failure={failure}
        duplicated={duplicated}
        checked={checked}
        duplicateCheck={duplicateCheck}
        resetCheck={resetCheck}
      />
    </>
  );
};

export default SignupContainer;

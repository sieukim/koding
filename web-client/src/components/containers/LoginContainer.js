import LoginPresenter from '../presenters/LoginPresenter';
import * as api from '../../modules/api';
import { useCallback, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../modules/auth';

const LoginContainer = () => {
  /* 로그인 */

  // 로그인 진행 중이면 true 값을 갖는다. => 회원가입 버튼을 비활성화함
  const [loading, setLoading] = useState(false);
  // 로그인 api 호출 결과로 로그인에 성공하면 true 값을 갖는다.
  const [success, setSuccess] = useState(false);
  // 로그인 api 호출 결과로 로그인에 실패하면 true 값을 갖는다.
  const [failure, setFailure] = useState(false);

  const dispatch = useDispatch();
  const onSetLogin = (user) => dispatch(setLogin(user));

  // 로그인 api 호출 함수
  const login = useCallback(
    async (user) => {
      setLoading(true);
      try {
        const loggedUser = await api.login(user);
        setSuccess(true);
        onSetLogin(loggedUser.data);
      } catch (e) {
        setFailure(true);
      } finally {
        setLoading(false);
      }
    },
    [onSetLogin],
  );

  return (
    <>
      {success && <Navigate to="/" />}
      <LoginPresenter login={login} loading={loading} failure={failure} />
    </>
  );
};

export default LoginContainer;

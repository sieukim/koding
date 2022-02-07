import GithubSignupPresenter from '../../presenters/auth/GithubSignupPresenter';
import * as api from '../../../modules/api';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLogin } from '../../../modules/auth';
import useAsync from '../../../hooks/useAsync';
import { useNavigate } from 'react-router-dom';

const GithubSignupContainer = () => {
  /* 중복 검사 */

  // 중복 검사 api 호출 결과로 중복이면 true 값을 갖는다.
  const [duplicated, setDuplicated] = useState(true);
  // 중복 검사 api 호출 결과로 검사를 하면 true 값을 갖는다.
  const [checked, setChecked] = useState(false);

  // 중복 검사 api 호출 함수
  const duplicateCheck = useCallback(async (key, value) => {
    try {
      await api.duplicateCheck(key, value);
      setDuplicated(false);
    } catch (e) {
      setDuplicated(true);
    } finally {
      setChecked(true);
    }
  }, []);

  /* 로그인/회원가입 */

  // github signup state
  const [githubSignupState, githubSignupFetch] = useAsync(
    (user) => api.githubVerify(user),
    [],
    true,
  );

  const dispatch = useDispatch();
  const onSetLogin = useCallback((user) => dispatch(setLogin(user)), []);

  // github user 정보 가져오기
  const githubUser = useSelector((state) => state.github.user);

  // github login/signup api 호출
  const githubSignup = useCallback(
    async (nickname) => {
      await githubSignupFetch({ ...githubUser, nickname: nickname });
    },
    [githubSignupFetch, githubUser],
  );

  const navigate = useNavigate();

  // github login state에 저장된 user를 이용하여 로그인 상태로 변경
  useEffect(() => {
    if (githubSignupState.success) {
      const user = githubSignupState.success.data;
      onSetLogin(user);
      navigate('/');
    }
  }, [onSetLogin, githubSignupState]);

  return (
    <>
      <GithubSignupPresenter
        githubSignup={githubSignup}
        githubSignupState={githubSignupState}
        duplicated={duplicated}
        checked={checked}
        duplicateCheck={duplicateCheck}
      />
    </>
  );
};

export default GithubSignupContainer;

import GithubVerifyPresenter from '../presenters/GithubVerifyPresenter';
import * as api from '../../modules/api';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLogin } from '../../modules/auth';
import { Navigate } from 'react-router-dom';
import useAsync from '../../hooks/useAsync';

const GithubVerifyContainer = () => {
  /* 중복 검사 */

  const [duplicated, setDuplicated] = useState(true);
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

  // 중복 검사 후 입력값이 변하는 경우 checked와 duplicated 값을 초기화
  const resetCheck = useCallback(() => {
    setDuplicated(true);
    setChecked(false);
  }, []);

  /* github verify */

  // githubLogin state
  const [githubVerifyState, githubVerifyFetch] = useAsync(
    (user) => api.githubVerify(user),
    [],
    true,
  );

  const dispatch = useDispatch();
  const onSetLogin = useCallback(
    (user) => dispatch(setLogin(user)),
    [dispatch],
  );

  // github user 정보 가져오기
  const githubUser = useSelector((state) => state.github.user);

  // github api 호출
  const githubVerify = useCallback(
    async (nickname) => {
      await githubVerifyFetch({ ...githubUser, nickname: nickname });
    },
    [githubVerifyFetch, githubUser],
  );

  // github login state에 저장된 user를 이용하여 로그인 상태로 변경
  useEffect(() => {
    if (githubVerifyState.success) {
      const user = githubVerifyState.success.data;
      onSetLogin(user);
    }
  }, [onSetLogin, githubVerifyState]);

  return (
    <>
      {githubVerifyState.success && <Navigate to="/" />}
      <GithubVerifyPresenter
        duplicated={duplicated}
        checked={checked}
        duplicateCheck={duplicateCheck}
        resetCheck={resetCheck}
        githubVerify={githubVerify}
        githubVerifyState={githubVerifyState}
      />
    </>
  );
};

export default GithubVerifyContainer;

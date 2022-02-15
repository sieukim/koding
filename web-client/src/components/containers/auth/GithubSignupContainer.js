import GithubSignupPresenter from '../../presenters/auth/GithubSignupPresenter';
import * as api from '../../../modules/api';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLogin } from '../../../modules/auth';
import useAsync from '../../../hooks/useAsync';
import { useNavigate } from 'react-router-dom';
import { useMessage } from '../../../hooks/useMessage';

const GithubSignupContainer = () => {
  // navigate
  const navigate = useNavigate();
  // 로그인 전역상태
  const dispatch = useDispatch();
  // eslint-disable-next-line
  const onSetLogin = useCallback((user) => dispatch(setLogin(user)), []);

  // 중복 검사 api 호출 결과로 중복이면 true 값을 갖는다.
  const [duplicated, setDuplicated] = useState(true);
  // 중복 검사 api 호출 결과로 검사를 하면 true 값을 갖는다.
  const [checked, setChecked] = useState(false);

  // 중복검사
  const onDuplicateCheck = useCallback(async (key, value) => {
    try {
      await api.duplicateCheck(key, value);
      setDuplicated(false);
    } catch (e) {
      setDuplicated(true);
    } finally {
      setChecked(true);
    }
  }, []);

  // github user
  const githubUser = useSelector((state) => state.github.user);

  // github 회원가입
  const [githubSignupState, githubSignupFetch] = useAsync(
    (user) => api.githubVerify(user),
    [],
    true,
  );

  // github 회원가입 핸들러
  const onGithubSignup = useCallback(
    (nickname) => githubSignupFetch({ ...githubUser, nickname: nickname }),
    [githubSignupFetch, githubUser],
  );

  // 회원가입 성공
  useEffect(() => {
    if (githubSignupState.success) {
      const user = githubSignupState.success.data;
      onSetLogin(user);
      navigate('/');
    }
  }, [githubSignupState, onSetLogin, navigate]);

  // message
  useMessage(githubSignupState, 'Hello World! 👻');

  return (
    <GithubSignupPresenter
      loading={githubSignupState.loading}
      onGithubSignup={onGithubSignup}
      duplicated={duplicated}
      checked={checked}
      onDuplicateCheck={onDuplicateCheck}
    />
  );
};

export default GithubSignupContainer;

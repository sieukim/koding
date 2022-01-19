import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { setLogin } from '../../modules/auth';
import * as api from '../../modules/api';
import { githubSignup } from '../../modules/github';

const GithubCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const code = query.get('code');

  if (!code) navigate('/login');

  const dispatch = useDispatch();

  // 로그인 상태로 변경
  const onSetLogin = useCallback(
    (user) => dispatch(setLogin(user)),
    [dispatch],
  );

  // 회원가입 정보를 상태로 저장
  const onGithubSignup = useCallback(
    (user) => dispatch(githubSignup(user)),
    [dispatch],
  );

  // 기존 사용자 로그입이면 true 값을 갖는다.
  const [existingUser, setExistingUser] = useState(false);
  // 신규 사용자 회원가입 & 로그인이면 true 값을 갖는다.
  const [newUser, setNewUser] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const loggedUser = await api.githubCallback(code);

        // 기존 사용자 로그인
        if (loggedUser.status === 200) {
          setExistingUser(true);
          onSetLogin(loggedUser.data);
        }

        // 신규 사용자 회원가입 & 로그인
        if (loggedUser.status === 201) {
          setNewUser(true);
          onGithubSignup(loggedUser.data);
        }
      } catch (e) {}
    })();
  }, [onSetLogin, code, onGithubSignup]);

  return (
    <>
      {existingUser && <Navigate to="/" />}
      {newUser && <Navigate to="/github/verify" />}
    </>
  );
};

export default GithubCallbackPage;

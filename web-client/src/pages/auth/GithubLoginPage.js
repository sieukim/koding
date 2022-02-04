import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { setLogin } from '../../modules/auth';
import * as api from '../../modules/api';
import { githubSignup } from '../../modules/github';
import { message, Spin } from 'antd';
import styled from 'styled-components';

const StyledPage = styled.div`
  display: flex;
  height: 600px;
  justify-content: center;
  align-items: center;
`;

const GithubLoginPage = () => {
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
          message.success('오늘도 멋진 하루 보내세요 ✨');
        }

        // 신규 사용자 회원가입 & 로그인
        if (loggedUser.status === 201) {
          setNewUser(true);
          onGithubSignup(loggedUser.data);
        }
      } catch (e) {
        message.error('오류가 발생했어요 😭 잠시 후 다시 시도해주세요!');
      }
    })();
  }, [onSetLogin, code, onGithubSignup]);

  return (
    <StyledPage>
      <Spin size="large" tip="로딩 중..." />
      {existingUser && <Navigate to="/" />}
      {newUser && <Navigate to="/github/signup" />}
    </StyledPage>
  );
};

export default GithubLoginPage;

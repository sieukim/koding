import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { setLogin } from '../../../modules/auth';
import { githubSignup } from '../../../modules/github';
import * as api from '../../../modules/api';
import { message, Spin } from 'antd';
import { StyledAuthPage } from '../../presenters/styled/auth/StyledAuthPage';

const GithubLoginContainer = ({ githubLoginCode }) => {
  // navigate
  const navigate = useNavigate();
  // 로그인 전역상태
  const dispatch = useDispatch();
  // eslint-disable-next-line
  const onSetLogin = useCallback((user) => dispatch(setLogin(user)), []);
  const onGithubSignup = useCallback(
    (user) => dispatch(githubSignup(user)),
    // eslint-disable-next-line
    [],
  );

  useEffect(() => {
    (async () => {
      try {
        const loggedUser = await api.githubCallback(githubLoginCode);

        // 기존 사용자 로그인
        if (loggedUser.status === 200) {
          onSetLogin(loggedUser.data);
          navigate('/');
          message.success('오늘도 멋진 하루 보내세요 ✨');
        }

        // 신규 사용자 회원가입 & 로그인
        if (loggedUser.status === 201) {
          navigate('/github/signup');
          onGithubSignup(loggedUser.data);
        }
      } catch (e) {
        message.error('오류가 발생했어요 😭 잠시 후 다시 시도해주세요!');
      }
    })();
  }, [githubLoginCode, onSetLogin, onGithubSignup, navigate]);

  return (
    <StyledAuthPage>
      <Spin size="large" tip="로딩 중..." />
    </StyledAuthPage>
  );
};

export default GithubLoginContainer;

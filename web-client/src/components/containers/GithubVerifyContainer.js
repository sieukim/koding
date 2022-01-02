import GithubVerifyPresenter from '../presenters/GithubVerifyPresenter';
import * as api from '../../modules/api';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLogin } from '../../modules/auth';
import { Navigate } from 'react-router-dom';

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

  // 회원가입 진행 중이면 true 값을 갖는다. => 회원가입 버튼을 비활성화함
  const [loading, setLoading] = useState(false);
  // 회원가입 api 호출 결과로 회원가입에 성공하면 true 값을 갖는다.
  const [success, setSuccess] = useState(false);
  // 회원가입 api 호출 결과로 회원가입에 실패하면 true 값을 갖는다.
  const [failure, setFailure] = useState(false);

  // 사용자 정보 가져오기
  const user = useSelector((state) => state.github.user);

  const dispatch = useDispatch();

  // 로그인 상태로 변경
  const onSetLogin = useCallback(
    (user) => dispatch(setLogin(user)),
    [dispatch],
  );

  const githubVerify = useCallback(
    async (nickname) => {
      setLoading(true);
      try {
        await api.githubVerify({ ...user, nickname: nickname });
        setLoading(false);
        setSuccess(true);
        onSetLogin({ ...user, nickname: nickname });
      } catch (e) {
        setFailure(true);
        setLoading(false);
      }
    },
    [onSetLogin, user],
  );

  return (
    <>
      {success && <Navigate to="/" />}
      <GithubVerifyPresenter
        duplicated={duplicated}
        checked={checked}
        duplicateCheck={duplicateCheck}
        resetCheck={resetCheck}
        githubVerify={githubVerify}
        loading={loading}
        failure={failure}
      />
    </>
  );
};

export default GithubVerifyContainer;

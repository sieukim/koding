import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import { PrintState } from '../../../utils/MyComponents';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogout } from '../../../modules/auth';

const StyledEditProfile = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  background: antiquewhite;
  padding: 10px;

  & > div {
    margin: 5px;
    padding: 5px;
  }

  form {
    display: flex;
    flex-direction: column;
    margin: 5px;
    padding: 0 5px;

    div {
      margin: 5px 0;
      padding: 5px 0;
    }
  }

  .url-container {
    display: flex;
    justify-content: space-between;

    .url {
      width: 80%;
      padding: 2px;
    }

    label {
      width: 15%;
      margin: auto 0;
      text-align: end;

      input {
        margin-right: 5px;
      }
    }
  }

  button {
    width: 100%;
    margin: 6px auto;
  }

  .password-container {
    input {
      padding: 2px;
      margin: 5px 0;
    }
  }
`;

const EditProfilePresenter = ({
  getLoginUserData = {},
  changeUserInfoState,
  changeUserInfoFetch,
  changePasswordState,
  changePasswordFetch,
  revokeState,
  revokeFetch,
}) => {
  /* 유저 정보 변경 */
  const [userInfo, setUserInfo] = useState({});

  // Input 관리
  const onChangeInput = useCallback((e) => {
    // 공개 여부 관리
    if (e.target.name.includes('Public')) {
      setUserInfo((userInfo) => ({
        ...userInfo,
        [e.target.name]: e.target.checked,
      }));
    }
    // url 정보 관리
    else {
      setUserInfo((userInfo) => ({
        ...userInfo,
        [e.target.name]: e.target.value,
      }));
    }
  }, []);

  // 정보 변경
  const onSubmitUserInfo = useCallback(
    (e) => {
      e.preventDefault();
      changeUserInfoFetch(userInfo);
    },
    [changeUserInfoFetch, userInfo],
  );

  /* 비밀번호 변경 */

  const onSubmitPassword = useCallback(
    (e) => {
      e.preventDefault();
      if (userInfo['newPassword'] === userInfo['newPassword-check']) {
        changePasswordFetch(userInfo);
      }
      setUserInfo((userInfo) => ({
        ...userInfo,
        currentPassword: '',
        newPassword: '',
        'newPassword-check': '',
      }));
    },
    [changePasswordFetch, userInfo],
  );

  /* 유저 탈퇴 */

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 로그 아웃 api 호출하는 함수
  const logout = useCallback(() => {
    dispatch(setLogout());
  }, [setLogout]);

  const onClickRevoke = useCallback(() => {
    revokeFetch(getLoginUserData.nickname);
  }, [revokeFetch, getLoginUserData]);

  useEffect(() => {
    if (revokeState.success) {
      logout();
      navigate('/');
    }
  }, [logout, navigate, revokeState.success]);

  console.log(revokeState);

  return (
    <StyledEditProfile>
      <div>닉네임</div>
      <div>{getLoginUserData.nickname}</div>
      <div>이메일</div>
      <div>{getLoginUserData.email}</div>
      <form onSubmit={onSubmitUserInfo}>
        <div>블로그</div>
        <div className="url-container">
          <input
            type="url"
            name="blogUrl"
            defaultValue={getLoginUserData.blogUrl}
            onChange={onChangeInput}
            className="url"
            placeholder="블로그 주소를 입력하세요."
          />
          <label>
            <input
              type="checkbox"
              name="isBlogUrlPublic"
              value="isBlogUrlPublic"
              defaultChecked={getLoginUserData.isBlogUrlPublic}
              onChange={onChangeInput}
            />
            공개
          </label>
        </div>

        <div>깃허브</div>
        <div className="url-container">
          <input
            type="url"
            name="githubUrl"
            defaultValue={getLoginUserData.githubUrl}
            onChange={onChangeInput}
            className="url"
            placeholder="깃허브 주소를 입력하세요."
          />
          <label>
            <input
              type="checkbox"
              name="isGithubUrlPublic"
              value="isGithubUrlPublic"
              defaultChecked={getLoginUserData.isGithubUrlPublic}
              onChange={onChangeInput}
            />
            공개
          </label>
        </div>

        <div>포트폴리오</div>
        <div className="url-container">
          <input
            type="url"
            name="portfolioUrl"
            defaultValue={getLoginUserData.portfolioUrl}
            onChange={onChangeInput}
            className="url"
            placeholder="포트폴리오 주소를 입력하세요."
          />
          <label>
            <input
              type="checkbox"
              name="isPortfolioUrlPublic"
              value="isPortfolioUrlPublic"
              defaultChecked={getLoginUserData.isPortfolioUrlPublic}
              onChange={onChangeInput}
            />
            공개
          </label>
        </div>
        <button>변경</button>
        <PrintState state={changeUserInfoState} />
        {changeUserInfoState.success && <div>변경되었습니다.</div>}
      </form>

      {getLoginUserData.isEmailUser && (
        <>
          <form className="password-container" onSubmit={onSubmitPassword}>
            <div>현재 비밀번호</div>
            <input
              type="password"
              name="currentPassword"
              value={userInfo['currentPassword'] ?? ''}
              placeholder="현재 비밀번호를 입력하세요."
              minLength="8"
              maxLength="16"
              autoComplete="current-password"
              onChange={onChangeInput}
            />
            <div>변경 비밀번호</div>
            <input
              type="password"
              name="newPassword"
              value={userInfo['newPassword'] ?? ''}
              placeholder="8 ~ 16자 영문 대소문자, 숫자, 특수문자를 사용하세요. "
              minLength="8"
              maxLength="16"
              autoComplete="new-password"
              onChange={onChangeInput}
            />
            <div>변경 비밀번호 확인</div>
            <input
              type="password"
              name="newPassword-check"
              value={userInfo['newPassword-check'] ?? ''}
              placeholder="변경 비밀번호를 다시 입력하세요. "
              minLength="8"
              maxLength="16"
              onChange={onChangeInput}
            />
            <button>변경</button>
          </form>
          <PrintState state={changePasswordState} />
          {changePasswordState.success && <div>변경되었습니다.</div>}
        </>
      )}
      <button onClick={onClickRevoke}>계정 삭제</button>
      <PrintState state={revokeState} />
    </StyledEditProfile>
  );
};

export default EditProfilePresenter;

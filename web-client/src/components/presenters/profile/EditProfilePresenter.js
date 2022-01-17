import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import { PrintState } from '../../../utils/MyComponents';

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
`;

const EditProfilePresenter = ({
  getLoginUserState,
  changeUserInfoState,
  changeUserInfoFetch,
}) => {
  /* 유저 정보 변경 */
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    // 초기값 설정
    if (getLoginUserState.success) {
      setUserInfo({
        isBlogUrlPublic: getLoginUserState.success?.data?.isBlogUrlPublic,
        blogUrl: getLoginUserState.success?.data?.blogUrl,
        isGithubUrlPublic: getLoginUserState.success?.data?.isGithubUrlPublic,
        githubUrl: getLoginUserState.success?.data?.githubUrl,
        isPortfolioUrlPublic:
          getLoginUserState.success?.data?.isPortfolioUrlPublic,
        portfolioUrl: getLoginUserState.success?.data?.portfolioUrl,
      });
    }
  }, [getLoginUserState.success]);

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

  return (
    <StyledEditProfile>
      <div>닉네임</div>
      <div>{getLoginUserState.success?.data?.nickname}</div>

      <div>이메일</div>
      <div>{getLoginUserState.success?.data?.email}</div>

      <form onSubmit={onSubmitUserInfo}>
        <div>블로그</div>
        <div className="url-container">
          <input
            type="url"
            name="blogUrl"
            defaultValue={getLoginUserState.success?.data?.blogUrl}
            onChange={onChangeInput}
            className="url"
          />
          <label>
            <input
              type="checkbox"
              name="isBlogUrlPublic"
              value="isBlogUrlPublic"
              defaultChecked={getLoginUserState.success?.data?.isBlogUrlPublic}
              onChange={onChangeInput}
            />
            공개
          </label>
        </div>
        <PrintState state={changeUserInfoState} />

        <div>깃허브</div>
        <div className="url-container">
          <input
            type="url"
            name="githubUrl"
            defaultValue={getLoginUserState.success?.data?.githubUrl}
            onChange={onChangeInput}
            className="url"
          />
          <label>
            <input
              type="checkbox"
              name="isGithubUrlPublic"
              value="isGithubUrlPublic"
              defaultChecked={
                getLoginUserState.success?.data?.isGithubUrlPublic
              }
              onChange={onChangeInput}
            />
            공개
          </label>
        </div>
        <PrintState state={changeUserInfoState} />

        <div>포트폴리오</div>
        <div className="url-container">
          <input
            type="url"
            name="portfolioUrl"
            defaultValue={getLoginUserState.success?.data?.portfolioUrl}
            onChange={onChangeInput}
            className="url"
          />
          <label>
            <input
              type="checkbox"
              name="isPortfolioUrlPublic"
              value="isPortfolioUrlPublic"
              defaultChecked={
                getLoginUserState.success?.data?.isPortfolioUrlPublic
              }
              onChange={onChangeInput}
            />
            공개
          </label>
        </div>
        <button>변경</button>
        <PrintState state={changeUserInfoState} />
        {changeUserInfoState.success && <div>URL 정보가 변경되었습니다.</div>}
      </form>
    </StyledEditProfile>
  );
};

export default EditProfilePresenter;

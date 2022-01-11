import styled from 'styled-components';
import { useCallback, useRef, useState } from 'react';
import { PrintState } from '../../../utils/MyComponents';

const StyledGithubVerify = styled.form`
  display: flex;
  flex-direction: column;
  width: 50%;

  & > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;
    width: 100%;

    input {
      width: 85%;
      height: 30px;
    }

    button {
      width: 10%;
      height: 30px;
    }

    .submit-button {
      width: 100%;
      height: 30px;
    }
  }
`;

const GithubVerifyPresenter = ({
  duplicated,
  checked,
  duplicateCheck,
  resetCheck,
  githubVerify,
  githubVerifyState,
}) => {
  /* 중복 검사 */

  const [nickname, setNickname] = useState();

  // Input 이벤트 핸들러
  const onChangeInput = useCallback(
    (e) => {
      setNickname(e.target.value);
      resetCheck();
    },
    [resetCheck],
  );

  // nickname ref
  const nicknameInput = useRef();

  // 중복 검사 버튼 이벤트 핸들러
  const onClickDuplicateCheckButton = useCallback(
    (e) => {
      const key = 'nickname';
      const value = nickname;

      if (nicknameInput.current.reportValidity()) {
        duplicateCheck(key, value);
      }
    },
    [nickname, duplicateCheck],
  );

  /* github verify */

  const onSubmitButton = useCallback(
    (e) => {
      e.preventDefault();
      githubVerify(nickname);
    },
    [nickname, githubVerify],
  );

  const validated = !githubVerifyState.loading && checked && !duplicated;

  return (
    <StyledGithubVerify onSubmit={onSubmitButton}>
      <p>닉네임 설정</p>
      <div>
        <input
          ref={nicknameInput}
          name="nickname"
          type="text"
          placeholder="영문 대소문자, 한글, 숫자를 사용하세요. (단, 띄어쓰기는 불가)"
          minLength="2"
          maxLength="10"
          pattern="[A-Za-z0-9가-힣]*"
          required
          onChange={onChangeInput}
        />
        <button
          data-name="nickname"
          onClick={onClickDuplicateCheckButton}
          disabled={validated}
          type="button"
        >
          중복 확인
        </button>
      </div>
      {validated && <p>가능한 닉네임입니다.</p>}
      {checked && duplicated && <p>중복된 닉네임입니다.</p>}

      <div>
        <button type="submit" className="submit-button" disabled={!validated}>
          회원가입
        </button>
      </div>
      <PrintState state={githubVerifyState} loading={true} />
    </StyledGithubVerify>
  );
};

export default GithubVerifyPresenter;

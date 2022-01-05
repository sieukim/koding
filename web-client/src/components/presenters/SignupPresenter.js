import styled from 'styled-components';
import { useCallback, useRef } from 'react';
import useInputs from '../../hooks/useInput';

const StyledSignup = styled.form`
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
      width: 85%;
      height: 30px;
    }
  }
`;

const SignupPresenter = ({
  signup,
  signupState,
  duplicated,
  checked,
  duplicateCheck,
  resetCheck,
}) => {
  /* 유저 정보 */

  // input 이벤트 핸들러
  const [form, onChange] = useInputs({
    email: '',
    password: '',
    'password-check': '',
    nickname: '',
    blog: '',
    github: '',
    portfolio: '',
  });

  const onChangeInput = useCallback(
    (e) => {
      onChange(e);

      // 만약 추가중인 정보가 id 또는 email, nickname이면 resetCheck 함수를 호출하여 중복 검사 초기화
      if (e.target.name === 'email' || e.target.name === 'nickname') {
        resetCheck(e.target.name);
      }
    },
    [resetCheck, onChange],
  );

  /* 중복 검사*/

  // email, nickname에 대한 DOM을 선택하기 위해 ref를 사용(useRef)
  const emailInput = useRef();
  const nicknameInput = useRef();

  // 중복 검사 버튼 이벤트 핸들러
  const onClickDuplicateCheckButton = useCallback(
    (e) => {
      const inputs = {
        email: emailInput,
        nickname: nicknameInput,
      };
      const key = e.target.dataset.name;
      const value = form[key];
      const input = inputs[key];

      // 현재 입력중인 값이 input 조건을 만족하면 중복 검사를 진행
      if (input.current.reportValidity()) {
        duplicateCheck(key, value);
      }
    },
    [form, duplicateCheck],
  );

  /* 회원가입 */

  // 회원가입 버튼 이벤트 핸들러
  const onSubmitButton = useCallback(
    (e) => {
      e.preventDefault();
      const user = {
        ...form,
      };
      delete user[`password-check`];
      signup(user);
    },
    [form, signup],
  );

  // email, nickname의 값이 유효한지에 대한 정보
  const validatedEmail = checked.email && !duplicated.email;
  const validatedNickname = checked.nickname && !duplicated.nickname;

  // 회원가입 진행중인지 email, nickname의 값은 유효한지 비밀번호와 비밀번호 확인란이 입력되어있으며 값이 동일한지에 대한 정보
  const disableButton =
    signupState.loading ||
    !validatedEmail ||
    !validatedNickname ||
    !form[`password`] ||
    !form[`password-check`] ||
    form[`password`] !== form[`password-check`];

  return (
    <StyledSignup onSubmit={onSubmitButton}>
      <p>이메일</p>
      <div>
        <input
          ref={emailInput}
          name="email"
          type="email"
          placeholder="이메일을 입력하세요."
          required
          onChange={onChangeInput}
        />
        <button
          data-name="email"
          onClick={onClickDuplicateCheckButton}
          disabled={validatedEmail}
          type="button"
        >
          중복 확인
        </button>
      </div>
      {validatedEmail && <p>가능한 이메일입니다.</p>}
      {checked.email && duplicated.email && <p>중복된 이메일입니다.</p>}

      <p>비밀번호</p>
      <div>
        <input
          name="password"
          type="password"
          placeholder="8 ~ 16자 영문 대소문자, 숫자, 특수문자를 사용하세요. "
          minLength="8"
          maxLength="16"
          required
          onChange={onChangeInput}
        />
      </div>

      <p>비밀번호 확인</p>
      <div>
        <input
          name="password-check"
          type="password"
          minLength="8"
          maxLength="16"
          required
          onChange={onChangeInput}
        />
      </div>

      <p>닉네임</p>
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
          disabled={validatedNickname}
          type="button"
        >
          중복 확인
        </button>
      </div>
      {validatedNickname && <p>가능한 별명입니다.</p>}
      {checked.nickname && duplicated.nickname && <p>중복된 별명입니다.</p>}

      <p>블로그(선택)</p>
      <div>
        <input
          name="blog"
          type="url"
          placeholder="블로그 주소를 입력하세요."
          onChange={onChangeInput}
        />
      </div>

      <p>깃허브(선택)</p>
      <div>
        <input
          name="github"
          type="url"
          placeholder="깃허브 주소를 입력하세요."
          onChange={onChangeInput}
        />
      </div>

      <p>포트폴리오(선택)</p>
      <div>
        <input
          name="portfolio"
          type="url"
          placeholder="포트폴리오 주소를 입력하세요."
          onChange={onChangeInput}
        />
      </div>

      <div>
        <button
          type="submit"
          className="submit-button"
          disabled={disableButton}
        >
          회원가입
        </button>
      </div>
      {signupState.error && <p>오류가 발생했습니다. 다시 시도해주세요.</p>}
    </StyledSignup>
  );
};

export default SignupPresenter;

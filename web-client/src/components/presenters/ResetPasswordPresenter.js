import styled from 'styled-components';
import { useCallback, useState } from 'react';

const StyledResetPassword = styled.form`
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
      width: 75%;
      height: 30px;
    }

    button {
      width: 20%;
      height: 30px;
    }

    .no-button-input {
      width: 100%;
    }

    .submit-button {
      width: 100%;
      height: 30px;
    }
  }

  p {
    margin: 3px 0;
  }
`;

const ResetPasswordPresenter = ({
  sendToken,
  sendState,
  verifyToken,
  verifyState,
  resetPassword,
  resetState,
  initializeState,
}) => {
  /* 정보 추가 */

  const [form, setForm] = useState({});

  // input 핸들러 이벤트
  const onChangeInput = useCallback(
    (e) => {
      // 현재 정보에서 입력중인 값을 추가
      setForm((form) => ({
        ...form,
        [e.target.name]: e.target.value,
      }));

      if (e.target.name === 'email' || e.target.name === 'verifiedToken') {
        initializeState();
      }
    },
    [initializeState],
  );

  /* 인증 코드 발송 */

  const onSendToken = useCallback(
    (e) => {
      e.preventDefault();
      const user = { email: form['email'] };
      sendToken(user);
    },
    [form, sendToken],
  );

  /* 인증 코드 확인 */

  const onVerifyToken = useCallback(
    (e) => {
      e.preventDefault();
      const user = { email: form['email'], verifyToken: form['verifyToken'] };
      verifyToken(user);
    },
    [form, verifyToken],
  );

  /* 비밀번호 변경 */

  const onResetPassword = useCallback(
    (e) => {
      e.preventDefault();
      const user = { ...form };
      delete user['password-check'];
      resetPassword(user);
    },
    [form, resetPassword],
  );

  // 비밀번호 변경 진행중인지, 유효한 토큰인지, 비밀번호와 비밀번호 확인란이 입력되어있으며 값이 동일한지에 대한 정보
  const disableButton =
    resetState.loading ||
    !sendState.success ||
    !verifyState.success ||
    !form['password'] ||
    !form['password-check'] ||
    form['password'] !== form['password-check'];

  return (
    <StyledResetPassword onSubmit={onResetPassword}>
      <p>이메일</p>
      <div>
        <input
          name="email"
          onChange={onChangeInput}
          placeholder="가입한 이메일을 입력하세요."
        />
        <button
          type="button"
          onClick={onSendToken}
          disabled={sendState.success}
        >
          인증 코드 발송
        </button>
      </div>
      {sendState.success && <p>인증 코드를 입력해주세요.</p>}
      {sendState.error && <p>일치하지 않는 회원 정보입니다.</p>}

      <p>인증 코드</p>
      <div>
        <input
          name="verifyToken"
          onChange={onChangeInput}
          placeholder="인증 코드를 입력하세요."
          disabled={sendState.success && verifyState.success}
        />
        <button
          type="button"
          onClick={onVerifyToken}
          disabled={sendState.success && verifyState.success}
        >
          인증 코드 확인
        </button>
      </div>
      {verifyState.success && <p>비밀 번호 변경을 진행해주세요.</p>}
      {verifyState.failure && <p>다시 입력해주세요.</p>}

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
          className="no-button-input"
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
          className="no-button-input"
        />
      </div>

      <div>
        <button
          type="submit"
          className="submit-button"
          disabled={disableButton}
        >
          비밀번호 변경
        </button>
      </div>
      {resetState.success && <p>비밀번호가 변경되었습니다.</p>}
      {resetState.failure && (
        <p>오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>
      )}
    </StyledResetPassword>
  );
};
export default ResetPasswordPresenter;

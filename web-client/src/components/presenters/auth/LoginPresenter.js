import styled from 'styled-components';
import { useCallback } from 'react';
import useInputs from '../../../hooks/useInput';

const StyledLogin = styled.form`
  display: flex;
  flex-direction: column;
  width: 50%;

  .findPassword {
    width: 85%;
    text-align: right;
    margin: 10px 0;
  }

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

    a {
      width: 100%;
    }

    a .github-button {
      width: 85%;
      height: 30px;
    }
  }
`;

const LoginPresenter = ({ login, loginState, url }) => {
  /* 유저 정보 */
  // input 이벤트 핸들러
  const [form, onChangeInputs] = useInputs({ email: '', password: '' });

  /* 로그인 */

  // 로그인 버튼 이벤트 핸들러
  const onSubmitButton = useCallback(
    (e) => {
      e.preventDefault();
      const user = {
        ...form,
      };
      login(user);
    },
    [form, login],
  );

  // 로그인 진행중인지에 대한 정보
  const disableButton = loginState.loading;

  return (
    <StyledLogin onSubmit={onSubmitButton}>
      <p>이메일</p>
      <div>
        <input
          name="email"
          type="email"
          placeholder="이메일"
          required
          onChange={onChangeInputs}
        />
      </div>

      <p>비밀번호</p>
      <div>
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          minLength="8"
          maxLength="16"
          required
          onChange={onChangeInputs}
        />
      </div>

      <a className="findPassword" href="/reset-password">
        비밀번호 초기화
      </a>

      <div>
        <button className="submit-button" disabled={disableButton}>
          로그인
        </button>
      </div>
      {loginState.error && <p>일치하지 않는 회원정보입니다.</p>}

      <div>
        <a href={url}>
          <button className="github-button" type="button">
            깃허브 로그인
          </button>
        </a>
      </div>
    </StyledLogin>
  );
};

export default LoginPresenter;

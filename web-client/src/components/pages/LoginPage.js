import LoginContainer from '../containers/LoginContainer';
import styled from 'styled-components';

const StyledLogin = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 60%;
`;

const LoginPage = () => {
  return (
    <StyledLogin>
      <LoginContainer />
    </StyledLogin>
  );
};

export default LoginPage;

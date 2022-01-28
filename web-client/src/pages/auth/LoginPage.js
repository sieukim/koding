import LoginContainer from '../../components/containers/auth/LoginContainer';
import styled from 'styled-components';

const StyledPage = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
`;

const LoginPage = () => {
  return (
    <StyledPage>
      <LoginContainer />
    </StyledPage>
  );
};

export default LoginPage;

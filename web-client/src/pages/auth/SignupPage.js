import styled from 'styled-components';
import SignupContainer from '../../components/containers/auth/SignupContainer';

const StyledPage = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
`;

const SignupPage = () => {
  return (
    <StyledPage>
      <SignupContainer />
    </StyledPage>
  );
};

export default SignupPage;

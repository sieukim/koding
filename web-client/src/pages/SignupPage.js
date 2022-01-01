import styled from 'styled-components';
import SignupContainer from '../components/containers/SignupContainer';

const StyledSignup = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 60%;
`;

const SignupPage = () => {
  return (
    <StyledSignup>
      <SignupContainer />
    </StyledSignup>
  );
};

export default SignupPage;

import styled from 'styled-components';
import EmailSignupContainer from '../../components/containers/auth/EmailSignupContainer';

const StyledPage = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
`;

const EmailSignupPage = () => {
  return (
    <StyledPage>
      <EmailSignupContainer />
    </StyledPage>
  );
};

export default EmailSignupPage;

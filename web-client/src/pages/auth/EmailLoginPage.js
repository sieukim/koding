import EmailLoginContainer from '../../components/containers/auth/EmailLoginContainer';
import styled from 'styled-components';

const StyledPage = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
`;

const EmailLoginPage = () => {
  return (
    <StyledPage>
      <EmailLoginContainer />
    </StyledPage>
  );
};

export default EmailLoginPage;

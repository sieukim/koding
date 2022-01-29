import ResetPasswordContainer from '../../components/containers/auth/ResetPasswordContainer';
import styled from 'styled-components';

const StyledPage = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
`;

const ResetPasswordPage = () => {
  return (
    <StyledPage>
      <ResetPasswordContainer />
    </StyledPage>
  );
};

export default ResetPasswordPage;

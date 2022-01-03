import ResetPasswordContainer from '../components/containers/ResetPasswordContainer';
import styled from 'styled-components';

const StyledResetPassword = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 60%;
`;

const ResetPasswordPage = () => {
  return (
    <StyledResetPassword>
      <ResetPasswordContainer />
    </StyledResetPassword>
  );
};

export default ResetPasswordPage;

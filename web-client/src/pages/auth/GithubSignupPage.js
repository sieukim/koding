import GithubSignupContainer from '../../components/containers/auth/GithubSignupContainer.js';
import styled from 'styled-components';

const StyledGithubVerify = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
`;

const GithubSignupPage = () => {
  return (
    <StyledGithubVerify>
      <GithubSignupContainer />
    </StyledGithubVerify>
  );
};

export default GithubSignupPage;

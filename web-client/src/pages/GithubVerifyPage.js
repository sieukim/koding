import GithubVerifyContainer from '../components/containers/GithubVerifyContainer';
import styled from 'styled-components';

const StyledGithubVerify = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 60%;
`;

const GithubVerifyPage = () => {
  return (
    <StyledGithubVerify>
      <GithubVerifyContainer />
    </StyledGithubVerify>
  );
};

export default GithubVerifyPage;

import { useLocation, useNavigate } from 'react-router-dom';
import GithubLoginContainer from '../../components/containers/auth/GithubLoginContainer';
import { StyledBody } from '../../components/presenters/styled/StyledBody';

const GithubLoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const githubLoginCode = query.get('code');

  if (!githubLoginCode) navigate('/login');

  return (
    <StyledBody>
      <GithubLoginContainer githubLoginCode={githubLoginCode} />
    </StyledBody>
  );
};

export default GithubLoginPage;

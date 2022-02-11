import { useSelector } from 'react-redux';
import HomeContainer from '../components/containers/HomeContainer';
import styled from 'styled-components';

const StyledPage = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
`;

const HomePage = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <StyledPage>
      <HomeContainer />
    </StyledPage>
  );
};

export default HomePage;

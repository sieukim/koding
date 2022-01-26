import IntegratedSearchContainer from '../../components/containers/search/IntegratedSearchContainer';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const StyledSearch = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 60%;
`;

const IntegratedSearchPage = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const query = searchParams.get('query');

  return (
    <StyledSearch>
      <IntegratedSearchContainer query={query} />
    </StyledSearch>
  );
};

export default IntegratedSearchPage;

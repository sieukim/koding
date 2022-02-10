import SearchContainer from '../../components/containers/search/SearchContainer';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const StyledPage = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 60%;
`;

const SearchPage = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const query = searchParams.get('query');

  return (
    <StyledPage>
      <SearchContainer query={query} />
    </StyledPage>
  );
};

export default SearchPage;

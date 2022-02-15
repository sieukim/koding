import SearchContainer from '../../components/containers/search/SearchContainer';
import { useLocation } from 'react-router-dom';
import { StyledBody } from '../../components/presenters/styled/StyledBody';

const SearchPage = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const query = searchParams.get('query');

  return (
    <StyledBody>
      <SearchContainer query={query} />
    </StyledBody>
  );
};

export default SearchPage;

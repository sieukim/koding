import SearchContainer from '../../components/containers/search/SearchContainer';
import styled from 'styled-components';
import { useLocation, useParams } from 'react-router-dom';

const StyledSearch = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 60%;
`;

const SearchPage = () => {
  const params = useParams();
  const boardType = params.boardType;

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const cursor = searchParams.get('cursor');
  const query = searchParams.get('query');

  return (
    <StyledSearch>
      <SearchContainer boardType={boardType} cursor={cursor} query={query} />
    </StyledSearch>
  );
};

export default SearchPage;

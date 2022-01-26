import styled from 'styled-components';
import SearchBar from '../../../utils/SearchBar';
import SearchResult from '../../../utils/SearchResult';

const StyledPage = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .container {
    display: flex;
    flex-direction: column;
    background: beige;
    margin: 10px;
    padding: 10px;
  }

  .result-container {
    height: 330px;
  }

  .paging-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
`;

const SearchPresenter = ({
  boardType,
  searchResults,
  hasPrevPage,
  hasNextPage,
  onClickPrevCursor,
  onClickNextCursor,
}) => {
  return (
    <StyledPage>
      <SearchBar className="search-page" boardType={boardType} />
      <div className="result-container">
        <SearchResult boardType={boardType} searchResults={searchResults} />
      </div>
      <div className="paging-button">
        <button disabled={!hasPrevPage} onClick={onClickPrevCursor}>
          이전
        </button>
        <button disabled={!hasNextPage} onClick={onClickNextCursor}>
          다음
        </button>
      </div>
    </StyledPage>
  );
};

export default SearchPresenter;

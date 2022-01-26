import styled from 'styled-components';
import SearchBar from '../../../utils/SearchBar';

import React from 'react';
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
`;

const IntegratedSearchPresenter = ({
  query,
  common,
  question,
  career,
  recruit,
  studyGroup,
  column,
}) => {
  return (
    <StyledPage>
      <SearchBar className="search-page" />
      <SearchResult query={query} boardType="common" searchResults={common} />
      <SearchResult
        query={query}
        boardType="question"
        searchResults={question}
      />
      <SearchResult query={query} boardType="career" searchResults={career} />
      <SearchResult query={query} boardType="recruit" searchResults={recruit} />
      <SearchResult
        query={query}
        boardType="study-group"
        searchResults={studyGroup}
      />
      <SearchResult query={query} boardType="column" searchResults={column} />
    </StyledPage>
  );
};

export default IntegratedSearchPresenter;

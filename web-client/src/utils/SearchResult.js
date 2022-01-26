import styled from 'styled-components';
import { MyPageLink, PostLink } from './MyComponents';
import { Chip } from '@material-ui/core';
import React from 'react';
import { boardMap } from './boardMap';

const StyledSearchResult = styled.div`
  hr {
    width: 100%;
  }

  .board-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .board-label {
    display: flex;
    flex-direction: row;
    font-weight: bold;

    div {
      align-self: center;
      margin-left: 10px;
    }
  }

  .search-result-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 5px 0;
  }

  .search-result {
    display: flex;
    flex-direction: row;
  }

  .search-result-tags {
    margin-left: 10px;

    * {
      margin: 3px;
    }
  }

  a {
    margin: auto 0;
  }
`;

const SearchResult = ({ query, boardType, searchResults }) => {
  return (
    <StyledSearchResult className="container">
      <div className="board-container">
        <div className="board-label">
          <div className="board-type">{boardMap[boardType]}</div>
          <Chip
            variant="outlined"
            label={searchResults.totalCount}
            size="small"
          />
        </div>
        {query && <a href={`/search/${boardType}?query=${query}`}>더보기</a>}
      </div>
      <hr />
      {/*{searchResults.totalCount === 0 && <div>검색 결과가 없습니다.</div>}*/}
      {searchResults.posts.length > 0 &&
        searchResults.posts.map((searchResult) => (
          <div className="search-result-container" key={searchResult.postId}>
            <div className="search-result">
              <PostLink
                boardType={searchResult.boardType}
                postId={searchResult.postId}
                postTitle={searchResult.title}
              />
              <div className="search-result-tags">
                {searchResult.tags.map((tag) => (
                  <Chip variant="outlined" label={tag} size="small" key={tag} />
                ))}
              </div>
            </div>
            <MyPageLink
              className="search-result-writer"
              nickname={searchResult.writerNickname}
            />
          </div>
        ))}
    </StyledSearchResult>
  );
};

export default SearchResult;

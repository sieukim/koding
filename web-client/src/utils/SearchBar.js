import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledSearch = styled.form`
  display: flex;
  justify-content: space-between;

  input {
    width: 85%;
  }

  button {
    width: 10%;
  }

  &.header {
    width: 30%;
  }

  &.search-page {
    width: 50%;
    margin: 0 auto;

    input,
    button {
      padding: 5px;
    }
  }
`;

const SearchBar = ({ className, boardType }) => {
  const [search, setSearch] = useState('');

  // 검색 내용 Input Change 이벤트 핸들러
  const onChangeInput = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const navigate = useNavigate();

  // 검색 Button Click 이벤트 핸들러
  const onSubmitButton = useCallback(
    (e) => {
      e.preventDefault();
      if (boardType) navigate(`/search/${boardType}?query=${search}`);
      else navigate(`/search?query=${search}`);
    },
    [navigate, boardType, search],
  );

  return (
    <StyledSearch className={className} onSubmit={onSubmitButton}>
      <input
        className="search"
        type="text"
        placeholder="Search..."
        onChange={onChangeInput}
      />
      <button>검색</button>
    </StyledSearch>
  );
};

export default SearchBar;

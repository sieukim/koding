import styled from 'styled-components';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Chip, TextField } from '@material-ui/core';

const StyledTag = styled.div``;

const SearchByTag = ({ onChangeTag, tags = [], defaultValue = [] }) => {
  return (
    <StyledTag>
      <Autocomplete
        id="tags"
        options={tags.map((tag) => tag)}
        defaultValue={defaultValue}
        multiple
        freeSolo
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="filled"
            placeholder="태그를 입력하세요."
            label="태그"
          />
        )}
        onChange={onChangeTag}
      />
    </StyledTag>
  );
};

export default SearchByTag;

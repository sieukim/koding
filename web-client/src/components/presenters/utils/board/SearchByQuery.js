import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { StyledSearchByQuery } from '../../styled/board/StyledSearchByQuery';

export const SearchByQuery = () => {
  return (
    <StyledSearchByQuery>
      <Input suffix={<SearchOutlined className="search-icon" />} />
    </StyledSearchByQuery>
  );
};

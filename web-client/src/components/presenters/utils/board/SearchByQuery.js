import { Form, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { StyledSearchByQuery } from '../../styled/board/StyledSearchByQuery';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const SearchByQuery = ({ boardType, queries }) => {
  // navigate
  const navigate = useNavigate();

  const [form] = Form.useForm();

  // 검색 onFinish(onSubmit) 핸들러
  const onFinish = useCallback(() => {
    const newQuery = form.getFieldValue('query');
    if (newQuery) queries.set('query', newQuery);
    navigate(`/board/${boardType}?${queries.toString()}`);
  }, [navigate, boardType, queries, form]);

  return (
    <StyledSearchByQuery>
      <Form form={form} name="search-form" onFinish={onFinish}>
        <Form.Item name="query">
          <Input
            suffix={
              <SearchOutlined className="search-icon" onClick={onFinish} />
            }
          />
        </Form.Item>
      </Form>
    </StyledSearchByQuery>
  );
};

import { useCallback } from 'react';
import { Button, Form, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { StyledSearchPage } from '../styled/search/StyledSearchPage';
import { StyledTitle } from '../styled/StyledTitle';
import { ResultCard } from '../utils/search/ResultCard';

const SearchPresenter = ({
  query,
  onClickSearch,
  blog,
  community,
  qna,
  recruit,
  studyGroup,
  users,
  getUsers,
  nextPageCursor,
}) => {
  const [form] = Form.useForm();

  // 검색 Form onFinish(onSubmit) 핸들러
  const onFinish = useCallback(() => {
    const query = form.getFieldValue('query');
    onClickSearch(query);
    form.resetFields(['query']);
  }, [form, onClickSearch]);

  return (
    <StyledSearchPage>
      <StyledTitle>통합 검색</StyledTitle>
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="query">
          <Input
            suffix={
              <Button
                htmlType="submit"
                type="text"
                icon={<SearchOutlined className="search-icon" />}
              />
            }
            placeholder="검색 내용을 입력하세요."
          />
        </Form.Item>
      </Form>
      <ResultCard
        type="post"
        title="커뮤니티"
        boardType="community"
        query={query}
        posts={community?.posts}
      />
      <ResultCard
        type="post"
        title="Q&A"
        boardType="qna"
        query={query}
        posts={qna?.posts}
      />
      <ResultCard
        type="post"
        title="채용 정보"
        boardType="recruit"
        query={query}
        posts={recruit?.posts}
      />
      <ResultCard
        type="post"
        title="스터디 모집"
        boardType="study-group"
        query={query}
        posts={studyGroup?.posts}
      />
      <ResultCard
        type="post"
        title="블로그"
        boardType="blog"
        query={query}
        posts={blog?.posts}
      />
      <ResultCard
        type="user"
        next={getUsers}
        hasMore={nextPageCursor}
        data={users}
      />
    </StyledSearchPage>
  );
};

export default SearchPresenter;

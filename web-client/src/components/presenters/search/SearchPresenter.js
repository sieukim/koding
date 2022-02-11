import styled from 'styled-components';
import { useCallback } from 'react';
import { PostList } from '../utils/post/PostList';
import { Button, Card, Form, Input, List, Spin } from 'antd';
import { NavLink } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { NicknameLink } from '../utils/link/NicknameLink';
import { AvatarLink } from '../utils/link/AvatarLink';

const StyledSearch = styled.div`
  border: 1px solid rgb(217, 217, 217);
  border-radius: 8px;
  margin: 50px 0;
  padding: 32px;
  width: 900px;

  .title-text {
    text-align: center;
    font-weight: bold;
    font-size: 32px;
    margin-bottom: 24px;
  }

  .ant-input-suffix {
    .anticon-search {
      font-size: 1rem;
      color: rgba(0, 0, 0, 0.45);
    }
  }

  .ant-card {
    margin: 30px 0;
  }

  .ant-list-item-meta-content {
    margin: auto 0;
  }
`;

const SearchPresenter = ({
  query,
  onClickSearch,
  column,
  common,
  question,
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
    <StyledSearch>
      <div className="title-text">통합 검색</div>
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="query">
          <Input
            suffix={
              <Button htmlType="submit" type="text" icon={<SearchOutlined />} />
            }
            placeholder="검색 내용을 입력하세요."
          />
        </Form.Item>
      </Form>
      <Card
        title="커뮤니티"
        extra={<NavLink to={`/board/common?search=${query}`}>더 보기</NavLink>}
      >
        <PostList posts={common?.posts} />
      </Card>
      <Card
        title="Q&A"
        extra={
          <NavLink to={`/board/question?search=${query}`}>더 보기</NavLink>
        }
      >
        <PostList posts={question?.posts} />
      </Card>
      <Card
        title="채용 정보"
        extra={<NavLink to={`/board/recruit?search=${query}`}>더 보기</NavLink>}
      >
        <PostList posts={recruit?.posts} />
      </Card>
      <Card
        title="스터디 모집"
        extra={
          <NavLink to={`/board/study-group?search=${query}`}>더 보기</NavLink>
        }
      >
        <PostList posts={studyGroup?.posts} />
      </Card>
      <Card
        title="블로그"
        extra={<NavLink to={`/board/column?search=${query}`}>더 보기</NavLink>}
      >
        <PostList posts={column?.posts} />
      </Card>
      <Card title="사용자">
        <InfiniteScroll
          next={getUsers}
          hasMore={nextPageCursor}
          loader={<Spin className="spinner" />}
          dataLength={users?.length}
        >
          <List
            dataSource={users}
            renderItem={(user) => (
              <List.Item key={user.nickname}>
                <List.Item.Meta
                  avatar={<AvatarLink nickname={user.nickname} />}
                  title={<NicknameLink nickname={user.nickname} />}
                />
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </Card>
    </StyledSearch>
  );
};

export default SearchPresenter;

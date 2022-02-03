import {
  Collapse,
  Comment,
  Divider,
  List,
  Skeleton,
  Tag,
  Typography,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PostLink } from '../../../utils/PostLink';
import markdownToTxt from 'markdown-to-txt';
import styled from 'styled-components';
import { EyeOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Panel } = Collapse;
const { Paragraph } = Typography;

const StyledPostList = styled.div`
  .collapse {
    width: 500px;
  }

  .ant-list-item-meta-title {
    display: flex;
    align-items: baseline;

    a {
      font-size: large;
    }

    .meta-data {
      .anticon {
        margin-right: 4px;
        margin-left: 16px;
      }
    }
  }

  .ant-list-item-meta-description {
    margin-top: 16px;

    .ant-typography {
      color: #00000073;
    }

    .ant-comment-inner {
      padding-top: 0;
    }

    .ant-comment-content-detail {
      color: black;
    }
  }

  .scrollableDiv {
    overflow: auto;
    height: 300px;
  }

  .ant-tag:hover {
    cursor: pointer;
  }
`;

const ItemList = ({ type, post, hasMore, next }) => {
  const navigate = useNavigate();

  // tag onClick 핸들러
  const onClickTag = useCallback(
    (e) => {
      const [boardType, tags] = e.target.dataset.metadata.split(',');
      navigate(`/board/${boardType}?tags=${tags}`);
    },
    [navigate],
  );

  return (
    <div id="scrollableDiv" className="scrollableDiv">
      <InfiniteScroll
        next={next}
        hasMore={hasMore}
        loader={<Skeleton />}
        dataLength={post.length}
        endMessage={<Divider plain />}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={post}
          renderItem={(item) =>
            type === 'post' ? (
              <List.Item>
                <List.Item.Meta
                  title={
                    <>
                      <PostLink
                        boardType={item.boardType}
                        postId={item.postId}
                        postTitle={item.title}
                      />
                      <div className="meta-data">
                        <LikeOutlined />
                        {item.likeCount ?? 0}
                        <MessageOutlined />
                        {item.commentCount ?? 0}
                        <EyeOutlined />
                        {item.readCount ?? 0}
                      </div>
                    </>
                  }
                  description={
                    <>
                      <Paragraph ellipsis={{ rows: 3 }}>
                        {markdownToTxt(item.markdownContent)}
                      </Paragraph>
                      {item.tags?.map((tag) => (
                        <Tag
                          key={tag}
                          data-metadata={[item.boardType, tag]}
                          onClick={onClickTag}
                        >
                          {tag}
                        </Tag>
                      ))}
                    </>
                  }
                />
              </List.Item>
            ) : (
              <List.Item>
                <List.Item.Meta
                  title={
                    <PostLink
                      boardType={item.boardType}
                      postId={item.postId}
                      postTitle={item.postTitle}
                    />
                  }
                  description={
                    <>
                      <Comment
                        author={item.writerNickname}
                        datetime={moment(item.createdAt).format(
                          'YYYY-MM-DD HH:mm:ss',
                        )}
                        content={
                          <Paragraph
                            ellipsis={{ rows: 3 }}
                            className="ant-comment-content-detail"
                          >
                            {markdownToTxt(item.content)}
                          </Paragraph>
                        }
                      />
                    </>
                  }
                />
              </List.Item>
            )
          }
        />
      </InfiniteScroll>
    </div>
  );
};

const TabPresenter = ({
  type,
  items,
  setItems,
  getItems,
  nextCursor,
  setNextCursor,
}) => {
  return (
    <StyledPostList>
      <Collapse accordion className="collapse" ghost>
        <Panel header="일반" key="common">
          <ItemList
            type={type}
            post={items.common}
            hasMore={nextCursor.common}
            next={getItems}
          />
        </Panel>
        <Panel header="질문" key="question">
          <ItemList
            type={type}
            post={items.question}
            hasMore={nextCursor.question}
            next={getItems}
          />
        </Panel>
        <Panel header="취업/진로" key="career">
          <ItemList
            type={type}
            post={items.career}
            hasMore={nextCursor.career}
            next={getItems}
          />
        </Panel>
        <Panel header="칼럼" key="column">
          <ItemList
            type={type}
            post={items.column}
            hasMore={nextCursor.column}
            next={getItems}
          />
        </Panel>
      </Collapse>
    </StyledPostList>
  );
};

export default TabPresenter;

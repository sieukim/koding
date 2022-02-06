import { List, Space, Spin, Tag } from 'antd';
import {
  EditOutlined,
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { PostLink } from './link/PostLink';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { NicknameLink } from './link/NicknameLink';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';
import { getTagColor } from './function/getTagColor';

const IconText = ({ icon, text, className }) => (
  <Space className={className}>
    {icon}
    {text}
  </Space>
);

const StyledTags = styled.div`
  .ant-tag:hover {
    cursor: pointer;
  }
`;

const Tags = ({ post, tags }) => {
  const navigate = useNavigate();

  // 태그 onClick 핸들러
  const onClickTag = useCallback(
    (e) => {
      const [boardType, tags] = e.target.dataset.metadata.split(',');
      navigate(`/board/${boardType}?tags=${tags}`);
    },
    [navigate],
  );

  return (
    <StyledTags>
      {tags.map((tag) => (
        <Tag
          key={tag}
          color={getTagColor(tag)}
          onClick={onClickTag}
          data-metadata={[post.boardType, tag]}
        >
          {tag}
        </Tag>
      ))}
    </StyledTags>
  );
};

const StyledPostList = styled.div`
  .spinner {
    width: 100%;
    text-align: center;
  }

  a:hover {
    color: #1890ff !important;

    * {
      color: #1890ff !important;
    }
  }

  .item-nickname,
  .item-read,
  .item-createdAt {
    * {
      color: black !important;
    }
  }

  .item-like {
    * {
      color: #cf1322 !important;
    }
  }

  .item-scrap {
    * {
      color: #faad14 !important;
    }
  }

  .item-comment {
    * {
      color: #096dd9 !important;
    }
  }
`;

export const PostList = ({ loading, posts, next, hasMore }) => {
  return (
    <StyledPostList>
      {loading ? (
        <div className="spinner">
          <Spin />
        </div>
      ) : (
        <InfiniteScroll next={next} hasMore={hasMore} dataLength={posts.length}>
          <List
            dataSource={posts}
            renderItem={(post) => (
              <List.Item
                key={post.postId}
                actions={[
                  <IconText
                    icon={<UserOutlined />}
                    text={<NicknameLink nickname={post.writerNickname} />}
                    className="item-nickname"
                  />,
                  <IconText
                    icon={<LikeOutlined />}
                    text={post.likeCount ?? 0}
                    className="item-like"
                  />,
                  <IconText
                    icon={<MessageOutlined />}
                    text={post.commentCount ?? 0}
                    className="item-comment"
                  />,
                  <IconText
                    icon={<StarOutlined />}
                    text={post.scrapCount ?? 0}
                    className="item-scrap"
                  />,
                  <IconText
                    icon={<EyeOutlined />}
                    text={post.readCount ?? 0}
                    className="item-read"
                  />,
                  <IconText
                    icon={<EditOutlined />}
                    text={moment(post.createdAt).format('YYYY.MM.DD HH:MM')}
                    className="item-createdAt"
                  />,
                ]}
              >
                <List.Item.Meta
                  title={
                    <PostLink
                      boardType={post.boardType}
                      postId={post.postId}
                      postTitle={post.title}
                    />
                  }
                />
                <PostLink
                  boardType={post.boardType}
                  postId={post.postId}
                  markdownContent={post.markdownContent ?? ''}
                />
                <Tags post={post} tags={post.tags} />
              </List.Item>
            )}
            itemLayout="vertical"
          />
        </InfiniteScroll>
      )}
    </StyledPostList>
  );
};

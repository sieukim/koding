import { List, Spin } from 'antd';
import { PostLink } from '../link/PostLink';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';
import { Tags } from './Tags';
import { IconText } from './IconText';
import {
  EyeOutlined,
  FieldTimeOutlined,
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { NicknameLink } from '../link/NicknameLink';
import React from 'react';
import { getRelativeCreatedAt } from '../function/getCreatedAt';

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

  .ant-list-item-main {
    padding: 20px;
  }

  .ant-list-item-extra {
    display: flex;
    align-items: center;

    a:hover {
      * {
        color: #f5f5f5 !important;
      }
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
                    key="nickname"
                    icon={<UserOutlined />}
                    text={<NicknameLink nickname={post.writerNickname} />}
                    className="item-nickname"
                  />,
                  <IconText
                    key="likeCount"
                    icon={<LikeOutlined />}
                    text={post.likeCount ?? 0}
                    className="item-like"
                  />,
                  <IconText
                    key="commentCount"
                    icon={<MessageOutlined />}
                    text={post.commentCount ?? 0}
                    className="item-comment"
                  />,
                  <IconText
                    key="scrapCount"
                    icon={<StarOutlined />}
                    text={post.scrapCount ?? 0}
                    className="item-scrap"
                  />,
                  <IconText
                    key="readCount"
                    icon={<EyeOutlined />}
                    text={post.readCount ?? 0}
                    className="item-read"
                  />,
                  <IconText
                    key="createdAt"
                    icon={<FieldTimeOutlined />}
                    text={getRelativeCreatedAt(post.createdAt)}
                    className="item-createdAt"
                  />,
                ]}
                extra={
                  <PostLink
                    boardType={post.boardType}
                    postId={post.postId}
                    imageUrls={post.imageUrls}
                  />
                }
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
                  markdownContent={post.markdownContent}
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

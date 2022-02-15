import { Card, List, Spin } from 'antd';
import { NavLink } from 'react-router-dom';
import { PostLink } from '../link/PostLink';
import React from 'react';

export const RankedPostList = ({ loading, boardType, title, posts }) => {
  return (
    <Card
      title={title}
      extra={<NavLink to={`/board/${boardType}`}>더 보기</NavLink>}
    >
      {loading ? (
        <Spin className="spinner" />
      ) : (
        <List
          dataSource={posts}
          renderItem={(post) => (
            <List.Item key={post.postId}>
              <List.Item.Meta
                title={
                  <PostLink
                    boardType={post.boardType}
                    postId={post.postId}
                    postTitle={post.title}
                  />
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

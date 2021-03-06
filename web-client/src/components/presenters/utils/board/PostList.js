import { Avatar, List, Spin } from 'antd';
import { IconText } from '../post/IconText';
import {
  EyeOutlined,
  FieldTimeOutlined,
  LikeOutlined,
  MessageOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { NicknameLink } from '../link/NicknameLink';
import { getCreatedAt } from '../function/getCreatedAt';
import { PostLink } from '../link/PostLink';
import { TagList } from '../post/TagList';
import React from 'react';
import { StyledPostList } from '../../styled/board/StyledPostList';
import { AvatarLink } from '../link/AvatarLink';

export const PostList = ({ loading, posts, profileUser }) => {
  const getAvatar = (post) => {
    if (profileUser) return <AvatarLink nickname={profileUser} />;
    else if (post?.writer?.avatarUrl)
      return <Avatar src={post.writer.avatarUrl} />;
    else return <Avatar icon={<UserOutlined />} />;
  };

  // 게시글 미리보기 내 alt_text 문자열 삭제
  const removeAltText = (post) => {
    post.replaceAll('alt_text', '');
  };

  return (
    <StyledPostList>
      {loading ? (
        <Spin className="spinner" />
      ) : (
        <List
          dataSource={posts}
          renderItem={(post) => (
            <List.Item
              key={post.postId}
              actions={[
                <IconText
                  key="nickname"
                  icon={getAvatar(post)}
                  text={<NicknameLink nickname={post.writerNickname} />}
                  className="item-nickname"
                />,
                <IconText
                  key="likeCount"
                  icon={<LikeOutlined />}
                  text={post.likeCount ?? 0}
                  className="item-red"
                />,
                <IconText
                  key="commentCount"
                  icon={<MessageOutlined />}
                  text={post.commentCount ?? 0}
                  className="item-blue"
                />,
                <IconText
                  key="scrapCount"
                  icon={<StarOutlined />}
                  text={post.scrapCount ?? 0}
                  className="item-yellow"
                />,
                <IconText
                  key="readCount"
                  icon={<EyeOutlined />}
                  text={post.readCount ?? 0}
                  className="item-black"
                />,
                <IconText
                  key="createdAt"
                  icon={<FieldTimeOutlined />}
                  text={getCreatedAt(post.createdAt)}
                  className="item-black"
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
                markdownContent={removeAltText(post.markdownContent)}
              />
              <TagList post={post} tags={post.tags} />
            </List.Item>
          )}
          itemLayout="vertical"
        />
      )}
    </StyledPostList>
  );
};

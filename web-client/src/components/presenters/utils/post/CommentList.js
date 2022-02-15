import { Avatar, Button, Comment, List, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getCreatedAt } from '../function/getCreatedAt';
import {
  DeleteOutlined,
  LikeOutlined,
  LikeTwoTone,
  UserOutlined,
} from '@ant-design/icons';
import { NicknameLink } from '../link/NicknameLink';
import { StyledCommentList } from '../../styled/post/StyledCommentList';
import { IconText } from './IconText';
import React from 'react';

const metadata = (user, comment, onClickLike, onClickUnlike, onClickRemove) => {
  const defaultMetadata = [
    <Button
      type="text"
      onClick={() =>
        comment.liked
          ? onClickUnlike(comment.commentId)
          : onClickLike(comment, comment.commentId)
      }
    >
      <IconText
        key="likeCount"
        icon={
          comment.liked ? (
            <LikeTwoTone twoToneColor="#cf1322" />
          ) : (
            <LikeOutlined />
          )
        }
        text={comment.likeCount ?? 0}
        className="item-red"
      />
    </Button>,
  ];

  const readerMetadata = [...defaultMetadata];

  const writerMetadata = [
    ...defaultMetadata,
    <Button type="text" onClick={() => onClickRemove(comment.commentId)}>
      <IconText key="remove" icon={<DeleteOutlined />} text="삭제" />
    </Button>,
  ];

  return user && user.nickname === comment.writerNickname
    ? writerMetadata
    : readerMetadata;
};

export const CommentList = ({
  user,
  loading,
  comments,
  next,
  hasMore,
  onClickLike,
  onClickUnlike,
  onClickRemove,
}) => {
  return (
    <StyledCommentList>
      {loading ? (
        <div className="spinner">
          <Spin />
        </div>
      ) : (
        <InfiniteScroll
          next={next}
          hasMore={hasMore}
          loader={null}
          dataLength={comments.length}
        >
          <List
            header="댓글"
            dataSource={comments}
            renderItem={(comment) => (
              <Comment
                key={comment.commentId}
                author={
                  <NicknameLink nickname={comment.writerNickname} /> ??
                  '탈퇴한 사용자'
                }
                avatar={
                  comment?.writer?.avatarUrl ? (
                    <Avatar src={comment.writer.avatarUrl} />
                  ) : (
                    <Avatar icon={<UserOutlined />} />
                  )
                }
                content={comment.content ?? ''}
                datetime={getCreatedAt(comment.createdAt ?? '')}
                actions={metadata(
                  user,
                  comment,
                  onClickLike,
                  onClickUnlike,
                  onClickRemove,
                )}
              />
            )}
            itemLayout="horizontal"
          />
        </InfiniteScroll>
      )}
    </StyledCommentList>
  );
};

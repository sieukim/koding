import {
  AlertOutlined,
  DeleteOutlined,
  LikeOutlined,
  LikeTwoTone,
} from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { IconText } from '../post/IconText';

export const metadata = (
  user,
  comment,
  onClickLike,
  onClickUnlike,
  onClickRemove,
) => {
  const defaultMetadata = [
    <Button
      type="text"
      onClick={() => (comment.liked ? onClickUnlike() : onClickLike())}
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

  const readerMetadata = [
    ...defaultMetadata,
    <IconText
      key="report"
      icon={<AlertOutlined />}
      text="신고"
      className="item-red"
    />,
  ];

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

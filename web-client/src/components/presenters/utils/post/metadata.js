import { IconText } from './IconText';
import {
  AlertOutlined,
  DeleteOutlined,
  EyeOutlined,
  FieldTimeOutlined,
  FormOutlined,
  LikeOutlined,
  LikeTwoTone,
  MessageOutlined,
  StarOutlined,
  StarTwoTone,
  UserOutlined,
} from '@ant-design/icons';
import { NicknameLink } from '../link/NicknameLink';
import { Avatar, Button } from 'antd';
import React from 'react';
import { getCreatedAt } from '../function/getCreatedAt';

export const metadata = (
  user,
  post,
  onClickLike,
  onClickUnlike,
  onClickScrap,
  onClickUnscrap,
  onClickEdit,
  onClickRemove,
) => {
  const defaultMetadata = [
    <IconText
      key="nickname"
      icon={
        post?.writer?.avatarUrl ? (
          <Avatar src={post.writer.avatarUrl} />
        ) : (
          <Avatar icon={<UserOutlined />} />
        )
      }
      text={<NicknameLink nickname={post.writerNickname} />}
      className="item-nickname"
    />,
    <Button
      type="text"
      onClick={() => (post.liked ? onClickUnlike() : onClickLike())}
    >
      <IconText
        key="likeCount"
        icon={
          post.liked ? <LikeTwoTone twoToneColor="#cf1322" /> : <LikeOutlined />
        }
        text={post.likeCount ?? 0}
        className="item-red"
      />
    </Button>,
    <IconText
      key="commentCount"
      icon={<MessageOutlined />}
      text={post.commentCount ?? 0}
      className="item-blue"
    />,
    <Button
      type="text"
      onClick={() => (post.scrapped ? onClickUnscrap() : onClickScrap())}
    >
      <IconText
        key="scrapCount"
        icon={
          post.scrapped ? (
            <StarTwoTone twoToneColor="#faad14" />
          ) : (
            <StarOutlined />
          )
        }
        text={post.scrapCount ?? 0}
        className="item-yellow"
      />
    </Button>,
    <IconText
      key="readCount"
      icon={<EyeOutlined />}
      text={post.readCount ?? 0}
      className="item-black"
    />,
    <IconText
      key="createdAt"
      icon={<FieldTimeOutlined />}
      text={getCreatedAt(post.createdAt ?? '')}
      className="item-black"
    />,
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
    <Button type="text" onClick={() => onClickEdit()}>
      <IconText
        key="edit"
        icon={<FormOutlined />}
        text="수정"
        className="item-black"
      />
    </Button>,
    <Button type="text" onClick={() => onClickRemove()}>
      <IconText
        key="remove"
        icon={<DeleteOutlined />}
        text="삭제"
        className="item-black"
      />
    </Button>,
  ];

  return user && user.nickname === post.writerNickname
    ? writerMetadata
    : readerMetadata;
};

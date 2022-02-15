import React, { useEffect, useRef } from 'react';
import { Viewer } from '../utils/editor/Viewer';
import { Avatar, Button, List, Spin } from 'antd';
import { TagList } from '../utils/post/TagList';
import { StyledPost } from '../styled/post/StyledPost';
import { IconText } from '../utils/post/IconText';
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
import { NicknameLink } from '../utils/link/NicknameLink';
import { getCreatedAt } from '../utils/function/getCreatedAt';

const metadata = (
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

const PostViewerPresenter = ({
  user,
  loading,
  post,
  onClickLike,
  onClickUnlike,
  onClickScrap,
  onClickUnscrap,
  onClickEdit,
  onClickRemove,
}) => {
  // 게시글 내용 viewer
  const viewerRef = useRef();

  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.getInstance().setMarkdown(post.markdownContent);
    }
  }, [viewerRef, post.markdownContent]);

  return (
    <StyledPost>
      {loading ? (
        <div className="spinner">
          <Spin />
        </div>
      ) : (
        <List
          dataSource={[post]}
          renderItem={(post) => (
            <List.Item
              key={post.postId}
              actions={metadata(
                user,
                post,
                onClickLike,
                onClickUnlike,
                onClickScrap,
                onClickUnscrap,
                onClickEdit,
                onClickRemove,
              )}
            >
              <List.Item.Meta
                title={<div className="post-title">{post.title}</div>}
              />
              <Viewer innerRef={viewerRef} />
              <TagList post={post} tags={post.tags ?? []} />
            </List.Item>
          )}
          itemLayout="vertical"
        />
      )}
    </StyledPost>
  );
};

export default PostViewerPresenter;

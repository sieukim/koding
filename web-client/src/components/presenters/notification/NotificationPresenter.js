import styled from 'styled-components';
import { Avatar, Button, Divider, List, Tooltip, Typography } from 'antd';
import {
  CheckOutlined,
  DeleteOutlined,
  MessageOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { NicknameLink } from '../../../utils/NicknameLink';
import moment from 'moment';
import { PostLink } from '../../../utils/PostLink';
import { useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const StyledNotification = styled.div`
  width: 600px;

  .title-text {
    text-align: center;
    font-weight: bold;
    font-size: 32px;
    margin-top: 24px;
  }

  .icons {
    text-align: right;
  }

  .ant-list {
    height: 600px;
  }

  .read-true {
    * {
      color: grey !important;
    }
  }

  .ant-list-item-meta {
    display: flex;
    align-items: center;

    .ant-avatar {
      background: white;
      color: #1890ff;
      font-size: 24px;
    }

    .anticon-warning {
      color: #fadb14;
    }
  }

  .ant-list-item-meta-title,
  .ant-list-item-meta-description {
    display: flex;
    flex-direction: row;
    align-items: center;

    a {
      color: #1890ff;
    }

    .meta-text {
      margin: 0 5px;
    }
  }

  .createdAt {
    color: grey;
  }

  .anticon-check,
  .anticon-delete {
    width: 12px;
    color: grey;
    margin-left: 10px;

    :hover {
      color: #1890ff;
    }
  }

  .footer-text {
    text-align: center;
    color: #1890ff;
    margin-top: 24px;
  }
`;

const CommentNotification = ({ notification }) => {
  const {
    commentWriterNickname,
    commentContent,
    postTitle,
    postId,
    boardType,
  } = notification.data;

  return (
    <List.Item.Meta
      avatar={<Avatar icon={<MessageOutlined />} />}
      title={
        <>
          <PostLink
            postTitle={postTitle}
            postId={postId}
            boardType={boardType}
          />
          <div className="meta-text">게시글에</div>
          <NicknameLink nickname={commentWriterNickname} />
          <div>님이 댓글을 남겼습니다.</div>
        </>
      }
      description={
        <Typography.Paragraph
          ellipsis={{ rows: 3, expandable: true, symbol: '더보기' }}
        >
          {commentContent}
        </Typography.Paragraph>
      }
    />
  );
};

const FollowNotification = ({ notification }) => {
  const { followerNickname } = notification.data;

  return (
    <List.Item.Meta
      avatar={<Avatar icon={<UserOutlined />} />}
      title={
        <>
          <NicknameLink nickname={followerNickname} />
          <div>님이 회원님을 팔로우합니다.</div>
        </>
      }
    />
  );
};

const MentionNotification = ({ notification }) => {
  const {
    commentWriterNickname,
    commentContent,
    postTitle,
    postId,
    boardType,
  } = notification.data;

  return (
    <List.Item.Meta
      avatar={<Avatar>@</Avatar>}
      title={
        <>
          <PostLink
            postTitle={postTitle}
            postId={postId}
            boardType={boardType}
          />
          <div className="meta-text">게시글 내 댓글에서</div>
          <NicknameLink nickname={commentWriterNickname} />
          <div>님이 회원님을 언급했습니다.</div>
        </>
      }
      description={
        <Typography.Paragraph
          ellipsis={{ rows: 3, expandable: true, symbol: '더보기' }}
        >
          {commentContent}
        </Typography.Paragraph>
      }
    />
  );
};

const CommentDeletedNotification = ({ notification }) => {
  const { content, postTitle, postId, boardType } = notification.data;

  return (
    <List.Item.Meta
      avatar={<Avatar icon={<WarningOutlined />} />}
      title={
        <>
          <PostLink
            postTitle={postTitle}
            postId={postId}
            boardType={boardType}
          />
          <div className="meta-text">
            에 작성한 댓글이 관리자에 의해 삭제되었습니다.
          </div>
        </>
      }
      description={
        <Typography.Paragraph
          ellipsis={{ rows: 3, expandable: true, symbol: '더보기' }}
        >
          {content}
        </Typography.Paragraph>
      }
    />
  );
};

const PostDeletedNotification = ({ notification }) => {
  const { title: postTitle, postId, boardType } = notification.data;

  return (
    <List.Item.Meta
      avatar={<Avatar icon={<WarningOutlined />} />}
      title={
        <>
          <div className="meta-text">게시글</div>
          <PostLink
            postTitle={postTitle}
            postId={postId}
            boardType={boardType}
          />
          <div className="meta-text">이 관리자에 의해 삭제되었습니다.</div>
        </>
      }
    />
  );
};

const Notification = ({ notification }) => {
  switch (notification.data.type) {
    case 'comment':
      return <CommentNotification notification={notification} />;
    case 'follow':
      return <FollowNotification notification={notification} />;
    case 'mention':
      return <MentionNotification notification={notification} />;
    case 'commentDeleted':
      return <CommentDeletedNotification notification={notification} />;
    case 'postDeleted':
      return <PostDeletedNotification notification={notification} />;
  }

  return <List.Item.Meta />;
};

const NotificationPresenter = ({
  loading,
  notifications,
  next,
  hasMore,
  removeNotification,
  removeAllNotification,
  readNotification,
  readAllNotification,
}) => {
  // 알림 삭제 onClick 핸들러
  const onClickRemove = useCallback(
    (e) => {
      const notificationId = e.currentTarget.dataset.notificationid;
      removeNotification(notificationId);
    },
    [removeNotification],
  );

  // 전체 알림 삭제 onClick 핸들러
  const onClickRemoveAll = useCallback(
    () => removeAllNotification(),
    [removeAllNotification],
  );

  // 알림 읽기 onClick 핸들러
  const onClickRead = useCallback(
    (e) => {
      const notificationId = e.currentTarget.dataset.notificationid;
      readNotification(notificationId);
    },
    [readNotification],
  );

  // 전체 알림 읽기 onClick 핸들러
  const onClickReadAll = useCallback(() => {
    readAllNotification();
  }, [readAllNotification]);

  return (
    <StyledNotification>
      <div className="title-text">알림</div>
      <div className="icons">
        <Tooltip placement="bottom" title="전체 읽기">
          <Button
            type="text"
            icon={<CheckOutlined />}
            onClick={onClickReadAll}
          />
        </Tooltip>
        <Tooltip placement="bottom" title="전체 삭제">
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={onClickRemoveAll}
          />
        </Tooltip>
      </div>
      <Divider style={{ margin: 0 }} />
      <InfiniteScroll
        next={next}
        hasMore={hasMore}
        loader={null}
        dataLength={notifications.length}
        height="600px"
        scrollThreshold={0.9}
      >
        <List
          dataSource={notifications}
          renderItem={(notification) => (
            <List.Item
              key={notification.notificationId}
              className={`read-${notification.read}`}
            >
              <Notification notification={notification} />
              <>
                <div className="createdAt">
                  {moment(notification.createdAt).format('MM/DD HH:MM')}
                </div>
                <Tooltip placement="bottom" title="읽기">
                  <Button
                    type="text"
                    icon={<CheckOutlined />}
                    data-notificationid={notification.notificationId}
                    onClick={onClickRead}
                  />
                </Tooltip>
                <Tooltip placement="bottom" title="삭제">
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    data-notificationid={notification.notificationId}
                    onClick={onClickRemove}
                  />
                </Tooltip>
              </>
            </List.Item>
          )}
          loading={loading}
        />
      </InfiniteScroll>
      <Divider />
      <div className="footer-text">모든 알림은 7일 후 자동 삭제됩니다.</div>
    </StyledNotification>
  );
};

export default NotificationPresenter;

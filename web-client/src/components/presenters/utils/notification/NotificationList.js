import InfiniteScroll from 'react-infinite-scroll-component';
import { Avatar, List, Typography } from 'antd';
import { getCreatedAt } from '../function/getCreatedAt';
import {
  CheckOutlined,
  DeleteOutlined,
  MessageOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { TooltipButton } from './TooltipButton';
import { PostLink } from '../link/PostLink';
import { NicknameLink } from '../link/NicknameLink';

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
      avatar={
        <Avatar icon={<MessageOutlined />} className="notification-avatar" />
      }
      title={
        <div className="notification-title">
          <PostLink
            postTitle={postTitle}
            postId={postId}
            boardType={boardType}
          />
          <p>게시글에</p>
          <NicknameLink nickname={commentWriterNickname} />
          <p>님이 댓글을 남겼습니다.</p>
        </div>
      }
      description={
        <div className="notification-description">
          <Typography.Paragraph
            ellipsis={{ rows: 3, expandable: true, symbol: '더보기' }}
          >
            {commentContent}
          </Typography.Paragraph>
        </div>
      }
    />
  );
};

const FollowNotification = ({ notification }) => {
  const { followerNickname } = notification.data;

  return (
    <List.Item.Meta
      avatar={
        <Avatar icon={<UserOutlined />} className="notification-avatar" />
      }
      title={
        <div className="notification-title">
          <NicknameLink nickname={followerNickname} />
          <p>님이 회원님을 팔로우합니다.</p>
        </div>
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
      avatar={<Avatar className="notification-avatar">@</Avatar>}
      title={
        <div className="notification-title">
          <PostLink
            postTitle={postTitle}
            postId={postId}
            boardType={boardType}
          />
          <p>게시글 내 댓글에서</p>
          <NicknameLink nickname={commentWriterNickname} />
          <p>님이 회원님을 언급했습니다.</p>
        </div>
      }
      description={
        <div className="notification-description">
          <Typography.Paragraph
            ellipsis={{ rows: 3, expandable: true, symbol: '더보기' }}
          >
            {commentContent}
          </Typography.Paragraph>
        </div>
      }
    />
  );
};

const CommentDeletedNotification = ({ notification }) => {
  const { content, postTitle, postId, boardType } = notification.data;

  return (
    <List.Item.Meta
      avatar={
        <Avatar
          icon={<WarningOutlined className="notification-warning" />}
          className="notification-avatar"
        />
      }
      title={
        <div className="notification-title">
          <PostLink
            postTitle={postTitle}
            postId={postId}
            boardType={boardType}
          />
          <p>에 작성한 댓글이 관리자에 의해 삭제되었습니다.</p>
        </div>
      }
      description={
        <div className="notification-description">
          <Typography.Paragraph
            ellipsis={{ rows: 3, expandable: true, symbol: '더보기' }}
          >
            {content}
          </Typography.Paragraph>
        </div>
      }
    />
  );
};

const PostDeletedNotification = ({ notification }) => {
  const { title: postTitle, postId, boardType } = notification.data;

  return (
    <List.Item.Meta
      avatar={
        <Avatar
          icon={<WarningOutlined className="notification-warning" />}
          className="notification-avatar"
        />
      }
      title={
        <div className="notification-title">
          <p>게시글</p>
          <PostLink
            postTitle={postTitle}
            postId={postId}
            boardType={boardType}
          />
          <p>이 관리자에 의해 삭제되었습니다.</p>
        </div>
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
    default:
      return <List.Item.Meta />;
  }
};

export const NotificationList = ({
  loading,
  next,
  hasMore,
  notifications,
  onClickRead,
  onClickRemove,
}) => {
  return (
    <InfiniteScroll
      next={next}
      hasMore={hasMore}
      loader={null}
      dataLength={notifications.length}
      height="600px"
    >
      <List
        loading={loading}
        dataSource={notifications}
        renderItem={(notification) => (
          <List.Item
            key={notification.notificationId}
            className={`notification read-${notification.read}`}
            actions={[
              <div>{getCreatedAt(notification.createdAt)}</div>,
              <TooltipButton
                tooltipTitle="읽기"
                buttonIcon={<CheckOutlined />}
                onClickButton={onClickRead}
                className="button button-read"
                notificationId={notification.notificationId}
              />,
              <TooltipButton
                tooltipTitle="삭제"
                buttonIcon={<DeleteOutlined />}
                onClickButton={onClickRemove}
                className="button button-remove"
                notificationId={notification.notificationId}
              />,
            ]}
          >
            <Notification notification={notification} />
          </List.Item>
        )}
      />
    </InfiniteScroll>
  );
};

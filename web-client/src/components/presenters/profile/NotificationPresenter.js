import styled from 'styled-components';
import { MyPageLink, PostLink } from '../../../utils/MyComponents';

const StyledNotification = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  div {
    margin: 5px;
    padding: 5px;
    background: gainsboro;
  }

  .post-title {
    color: red;
  }

  .paging-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
`;

const Notification = ({ notification }) => {
  const {
    type,
    boardType,
    postId,
    postTitle,
    commentWriterNickname,
    commentContent,
    followerNickname,
  } = notification.data;

  switch (type) {
    case 'comment':
      return (
        <div>
          <MyPageLink nickname={commentWriterNickname} />
          님이 &nbsp;
          <PostLink
            boardType={boardType}
            postId={postId}
            postTitle={postTitle}
            className="post-title"
          />
          &nbsp; 게시글에 댓글을 남겼습니다.
          <div>{commentContent}</div>
        </div>
      );
    case 'mention':
      return (
        <div>
          <MyPageLink nickname={commentWriterNickname} />
          님이 &nbsp;
          <PostLink
            boardType={boardType}
            postId={postId}
            postTitle={postTitle}
            className="post-title"
          />
          &nbsp; 게시글에서 회원님을 언급했습니다.
          <div>{commentContent}</div>
        </div>
      );
    case 'follow':
      return (
        <div>
          <MyPageLink nickname={followerNickname} />
          님이 회원님을 팔로우했습니다.
        </div>
      );
    default:
      return;
  }
};

const NotificationPresenter = ({
  notifications,
  prevCursor,
  nextCursor,
  onClickPrevCursor,
  onClickNextCursor,
}) => {
  return (
    <StyledNotification>
      {notifications.map((notification) => (
        <Notification
          notification={notification}
          key={notification.notificationId}
        />
      ))}
      <div className="paging-button">
        <button onClick={onClickPrevCursor} disabled={!prevCursor}>
          이전
        </button>
        <button onClick={onClickNextCursor} disabled={!nextCursor}>
          다음
        </button>
      </div>
    </StyledNotification>
  );
};

export default NotificationPresenter;

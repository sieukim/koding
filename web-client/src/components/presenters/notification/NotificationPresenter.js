import { Divider } from 'antd';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { useCallback } from 'react';
import { StyledNotificationPage } from '../styled/notification/StyledNotificationPage';
import { StyledTitle } from '../styled/StyledTitle';
import { NotificationList } from '../utils/notification/NotificationList';
import { TooltipButton } from '../utils/notification/TooltipButton';

const NotificationPresenter = ({
  loading,
  notifications,
  next,
  hasMore,
  onRemoveNotification,
  onRemoveAllNotification,
  onReadNotification,
  onReadAllNotification,
}) => {
  // 알림 삭제 onClick 핸들러
  const onClickRemove = useCallback(
    (e) => {
      const notificationId = e.currentTarget.dataset.notificationid;
      onRemoveNotification(notificationId);
    },
    [onRemoveNotification],
  );

  // 전체 알림 삭제 onClick 핸들러
  const onClickRemoveAll = useCallback(
    () => onRemoveAllNotification(),
    [onRemoveAllNotification],
  );

  // 알림 읽기 onClick 핸들러
  const onClickRead = useCallback(
    (e) => {
      const notificationId = e.currentTarget.dataset.notificationid;
      onReadNotification(notificationId);
    },
    [onReadNotification],
  );

  // 전체 알림 읽기 onClick 핸들러
  const onClickReadAll = useCallback(() => {
    onReadAllNotification();
  }, [onReadAllNotification]);

  return (
    <StyledNotificationPage>
      <StyledTitle>알림</StyledTitle>
      <div className="button-container">
        <TooltipButton
          tooltipTitle="전체 읽기"
          buttonIcon={<CheckOutlined />}
          onClickButton={onClickReadAll}
          className="button button-readAll"
        />
        <TooltipButton
          tooltipTitle="전체 삭제"
          buttonIcon={<DeleteOutlined />}
          onClickButton={onClickRemoveAll}
          className="button button-removeAll"
        />
      </div>
      <Divider />
      <NotificationList
        loading={loading}
        next={next}
        hasMore={hasMore}
        notifications={notifications}
        onClickRead={onClickRead}
        onClickRemove={onClickRemove}
      />
      <Divider />
      <div className="footer-text">모든 알림은 7일 후 자동 삭제됩니다.</div>
    </StyledNotificationPage>
  );
};

export default NotificationPresenter;

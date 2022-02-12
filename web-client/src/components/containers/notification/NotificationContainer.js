import NotificationPresenter from '../../presenters/notification/NotificationPresenter';
import { useSelector } from 'react-redux';
import useAsync from '../../../hooks/useAsync';
import * as api from '../../../modules/api';
import { useCallback, useEffect, useState } from 'react';
import { useMessage } from '../../../hooks/useMessage';

const NotificationContainer = () => {
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [nextPageCursor, setNextPageCursor] = useState(null);

  // 알림 조회
  const getNotification = useCallback(async () => {
    setLoading(true);
    const response = await api.getNotifications(user.nickname, nextPageCursor);
    setNotifications((notifications) => [
      ...notifications,
      ...response.data.notifications,
    ]);
    setNextPageCursor(response.data.nextPageCursor);
    setLoading(false);
  }, [user, nextPageCursor]);

  useEffect(() => {
    getNotification();
    // eslint-disable-next-line
  }, []);

  // 알림 삭제
  const [removeNotificationState, removeNotificationFetch] = useAsync(
    (notificationId) => api.removeNotification(user.nickname, notificationId),
    [user],
    true,
  );

  const onRemoveNotification = useCallback(
    async (notificationId) => {
      await removeNotificationFetch(notificationId);
      setNotifications((notifications) =>
        notifications.filter(
          (notification) => notification.notificationId !== notificationId,
        ),
      );
    },
    [removeNotificationFetch],
  );

  // message
  useMessage(removeNotificationState, '알림을 삭제했습니다 ✂️');

  // 전체 알림 삭제
  const [removeAllNotificationState, removeAllNotificationFetch] = useAsync(
    () => api.removeAllNotification(user.nickname),
    [user],
    true,
  );

  const onRemoveAllNotification = useCallback(async () => {
    await removeAllNotificationFetch();
    setNotifications([]);
  }, [removeAllNotificationFetch]);

  // message
  useMessage(removeAllNotificationState, '알림을 모두 삭제했습니다 ✂️');

  // 알림 읽기
  const [readNotificationState, readNotificationFetch] = useAsync(
    (notificationId) => api.readNotification(user.nickname, notificationId),
    [user],
    true,
  );

  const onReadNotification = useCallback(
    async (notificationId) => {
      await readNotificationFetch(notificationId);
      setNotifications((notifications) =>
        notifications.map((notification) =>
          notification.notificationId === notificationId
            ? { ...notification, read: true }
            : notification,
        ),
      );
    },
    [readNotificationFetch],
  );

  // message
  useMessage(readNotificationState, '알림을 읽었습니다 😎');

  // 전체 알림 읽기
  const [readAllNotificationState, readAllNotificationFetch] = useAsync(
    () => api.readAllNotifications(user.nickname),
    [user],
    true,
  );

  const onReadAllNotification = useCallback(async () => {
    await readAllNotificationFetch();
    setNotifications((notifications) =>
      notifications.map((notification) => ({ ...notification, read: true })),
    );
  }, [readAllNotificationFetch]);

  // message
  useMessage(readAllNotificationState, '알림을 모두 읽었습니다 😎');

  return (
    <NotificationPresenter
      loading={loading}
      notifications={notifications}
      setNotifications={setNotifications}
      next={getNotification}
      hasMore={nextPageCursor}
      onRemoveNotification={onRemoveNotification}
      onRemoveAllNotification={onRemoveAllNotification}
      onReadNotification={onReadNotification}
      onReadAllNotification={onReadAllNotification}
    />
  );
};
export default NotificationContainer;

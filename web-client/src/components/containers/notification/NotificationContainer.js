import NotificationPresenter from '../../presenters/notification/NotificationPresenter';
import { useSelector } from 'react-redux';
import useAsync from '../../../hooks/useAsync';
import * as api from '../../../modules/api';
import { useCallback, useEffect, useState } from 'react';

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
  }, []);

  // 알림 삭제
  const [removeNotificationState, removeNotificationFetch] = useAsync(
    (notificationId) => api.removeNotification(user.nickname, notificationId),
    [user],
    true,
  );

  const removeNotification = useCallback(
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

  // 전체 알림 삭제
  const [removeAllNotificationState, removeAllNotificationFetch] = useAsync(
    () => api.removeAllNotification(user.nickname),
    [user],
    true,
  );

  const removeAllNotification = useCallback(async () => {
    await removeAllNotificationFetch();
    setNotifications([]);
  }, [removeNotificationFetch]);

  // 알림 읽기
  const [readNotificationState, readNotificationFetch] = useAsync(
    (notificationId) => api.readNotification(user.nickname, notificationId),
    [user],
    true,
  );

  const readNotification = useCallback(
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

  // 전체 알림 읽기
  const [readAllNotificationState, readAllNotificationFetch] = useAsync(
    () => api.readAllNotifications(user.nickname),
    [user],
    true,
  );

  const readAllNotification = useCallback(async () => {
    await readAllNotificationFetch();

    setNotifications((notifications) =>
      notifications.map((notification) => ({ ...notification, read: true })),
    );
  }, [readAllNotificationFetch]);

  return (
    <NotificationPresenter
      loading={loading}
      notifications={notifications}
      setNotifications={setNotifications}
      next={getNotification}
      hasMore={nextPageCursor}
      removeNotification={removeNotification}
      removeAllNotification={removeAllNotification}
      readNotification={readNotification}
      readAllNotification={readAllNotification}
    />
  );
};
export default NotificationContainer;

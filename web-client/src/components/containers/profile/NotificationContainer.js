import NotificationPresenter from '../../presenters/profile/NotificationPresenter';
import { useSelector } from 'react-redux';
import useAsync from '../../../hooks/useAsync';
import * as api from '../../../modules/api';

const NotificationContainer = ({ cursor }) => {
  const user = useSelector((state) => state.auth.user);

  /* 알림 조회 */
  const [getNotificationsState] = useAsync(
    () => api.getNotifications(user.nickname, cursor),
    [user, cursor],
    false,
  );

  return (
    <NotificationPresenter
      notifications={getNotificationsState.success?.data?.notifications ?? []}
    />
  );
};

export default NotificationContainer;

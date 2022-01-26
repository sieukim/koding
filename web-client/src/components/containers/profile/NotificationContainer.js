import NotificationPresenter from '../../presenters/profile/NotificationPresenter';
import { useSelector } from 'react-redux';
import useAsync from '../../../hooks/useAsync';
import * as api from '../../../modules/api';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationContainer = ({ cursor }) => {
  const user = useSelector((state) => state.auth.user);

  /* 알림 조회 */
  const [getNotificationsState] = useAsync(
    () => api.getNotifications(user.nickname, cursor),
    [user, cursor],
    false,
  );

  // 알림 페이징
  const navigate = useNavigate();

  const prevPageCursor = getNotificationsState.success?.data?.prevPageCursor;

  const onClickPrevCursor = useCallback(() => {
    const query = new URLSearchParams();
    if (prevPageCursor) query.set('cursor', prevPageCursor);
    navigate(`/user/${user.nickname}/notification?${query}`);
  }, [prevPageCursor, navigate, user.nickname]);

  const nextPageCursor = getNotificationsState.success?.data?.nextPageCursor;

  const onClickNextCursor = useCallback(() => {
    const query = new URLSearchParams();
    if (nextPageCursor) query.set('cursor', nextPageCursor);
    navigate(`/user/${user.nickname}/notification?${query}`);
  }, [nextPageCursor, navigate, user.nickname]);

  return (
    <NotificationPresenter
      notifications={getNotificationsState.success?.data?.notifications ?? []}
      prevCursor={prevPageCursor}
      nextCursor={nextPageCursor}
      onClickPrevCursor={onClickPrevCursor}
      onClickNextCursor={onClickNextCursor}
    />
  );
};
export default NotificationContainer;

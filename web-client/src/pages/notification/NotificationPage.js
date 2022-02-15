import NotificationContainer from '../../components/containers/notification/NotificationContainer';
import { StyledBody } from '../../components/presenters/styled/StyledBody';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';

const NotificationPage = () => {
  // 로그인 유저
  const user = useSelector((state) => state.auth.user);

  // 페이지 유저
  const params = useParams();
  const nickname = params.nickname;

  // navigate
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.nickname !== nickname) {
      message.warning('접근 권한이 없습니다.');
      navigate('/');
    }
  }, [user, nickname, navigate]);

  return (
    <StyledBody>
      {user && user.nickname === nickname && <NotificationContainer />}
    </StyledBody>
  );
};

export default NotificationPage;

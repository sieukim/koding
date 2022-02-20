import EditProfileContainer from '../../components/containers/profile/EditProfileContainer';
import { useNavigate, useParams } from 'react-router-dom';
import { StyledBody } from '../../components/presenters/styled/StyledBody';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { message } from 'antd';

const EditProfilePage = () => {
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
      <EditProfileContainer user={user} />
    </StyledBody>
  );
};

export default EditProfilePage;

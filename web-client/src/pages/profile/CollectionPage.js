import CollectionContainer from '../../components/containers/profile/CollectionContainer';
import { StyledBody } from '../../components/presenters/styled/StyledBody';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { message } from 'antd';

const CollectionPage = () => {
  const params = useParams();
  const profileUser = params.nickname;
  const loginUser = useSelector((state) => state.auth.user);

  // navigate
  const navigate = useNavigate();

  useEffect(() => {
    if (!loginUser || loginUser.nickname !== profileUser) {
      message.warning('접근 권한이 없습니다.');
      navigate('/');
    }
  }, [loginUser, profileUser, navigate]);

  return (
    <StyledBody>
      <CollectionContainer profileUser={profileUser} />
    </StyledBody>
  );
};

export default CollectionPage;

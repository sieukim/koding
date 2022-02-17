import FollowListContainer from '../../components/containers/profile/FollowListContainer';
import { useParams } from 'react-router-dom';
import { StyledBody } from '../../components/presenters/styled/StyledBody';

const FollowListPage = () => {
  const params = useParams();
  // 페이지 유저
  const profileUser = params.nickname;
  // 페이지 종류
  const type = params.type;

  return (
    <StyledBody flexDirection="column">
      <FollowListContainer profileUser={profileUser} type={type} />
    </StyledBody>
  );
};

export default FollowListPage;

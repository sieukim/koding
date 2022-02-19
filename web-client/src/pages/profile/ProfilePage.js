import ProfileContainer from '../../components/containers/profile/ProfileContainer';
import { useParams } from 'react-router-dom';
import ActivityListContainer from '../../components/containers/profile/ActivityListContainer';
import { StyledBody } from '../../components/presenters/styled/StyledBody';

const ProfilePage = () => {
  const params = useParams();
  const profileUser = params.nickname;

  return (
    <StyledBody flexDirection="column">
      <ProfileContainer profileUser={profileUser} />
      <ActivityListContainer profileUser={profileUser} />
    </StyledBody>
  );
};

export default ProfilePage;

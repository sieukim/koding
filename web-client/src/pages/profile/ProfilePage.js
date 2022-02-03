import styled from 'styled-components';
import ProfileContainer from '../../components/containers/profile/ProfileContainer';
import { useParams } from 'react-router-dom';
import TabContainer from '../../components/containers/profile/TabContainer';

const StyledProfile = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
`;

const ProfilePage = () => {
  const params = useParams();
  const profileUser = params.nickname;

  return (
    <StyledProfile>
      <ProfileContainer profileUser={profileUser} />
      <TabContainer profileUser={profileUser} />
    </StyledProfile>
  );
};

export default ProfilePage;

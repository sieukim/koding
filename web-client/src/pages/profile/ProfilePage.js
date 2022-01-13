import styled from 'styled-components';
import ProfileContainer from '../../components/containers/profile/ProfileContainer';
import { useParams } from 'react-router-dom';

const StyledProfile = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 60%;
`;

const ProfilePage = () => {
  const params = useParams();
  const profileUserNickname = params.nickname;

  return (
    <StyledProfile>
      <ProfileContainer profileUserNickname={profileUserNickname} />
    </StyledProfile>
  );
};

export default ProfilePage;

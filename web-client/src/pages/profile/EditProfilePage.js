import EditProfileContainer from '../../components/containers/profile/EditProfileContainer';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

const StyledEditProfile = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 60%;
`;

const EditProfilePage = () => {
  const params = useParams();
  const profileNickname = params.nickname;

  return (
    <StyledEditProfile>
      <EditProfileContainer profileNickname={profileNickname} />
    </StyledEditProfile>
  );
};

export default EditProfilePage;

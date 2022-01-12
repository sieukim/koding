import FollowListContainer from '../components/containers/profile/FollowListContainer';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const StyledFollowList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 30%;
`;

const FollowListPage = () => {
  const params = useParams();
  const profileNickname = params.nickname;
  const type = params.type;

  return (
    <StyledFollowList>
      <FollowListContainer profileNickname={profileNickname} type={type} />
    </StyledFollowList>
  );
};

export default FollowListPage;

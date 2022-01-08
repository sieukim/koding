import styled from 'styled-components';
import MyPageContainer from '../components/containers/MyPageContainer';
import { useParams } from 'react-router-dom';

const StyledMyPage = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 60%;
`;

const MyPage = () => {
  const params = useParams();
  const userNickname = params.nickname;

  return (
    <StyledMyPage>
      <MyPageContainer userNickname={userNickname} />
    </StyledMyPage>
  );
};

export default MyPage;

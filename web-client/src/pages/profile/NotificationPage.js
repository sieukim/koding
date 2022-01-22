import NotificationContainer from '../../components/containers/profile/NotificationContainer';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const StyledNotification = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 60%;
`;

const NotificationPage = () => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const cursor = searchParams.get('cursor');

  return (
    <StyledNotification>
      <NotificationContainer cursor={cursor} />
    </StyledNotification>
  );
};

export default NotificationPage;

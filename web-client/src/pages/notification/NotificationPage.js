import NotificationContainer from '../../components/containers/notification/NotificationContainer';
import styled from 'styled-components';

const StyledNotification = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
`;

const NotificationPage = () => {
  return (
    <StyledNotification>
      <NotificationContainer />
    </StyledNotification>
  );
};

export default NotificationPage;

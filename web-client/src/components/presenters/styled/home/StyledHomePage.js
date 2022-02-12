import styled from 'styled-components';

export const StyledHomePage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin: 50px 0;
  padding: 32px;
  width: 900px;

  .card-container {
    display: flex;
    justify-content: space-around;

    margin: 20px;
    width: 100%;

    .ant-card-bordered {
      width: 45%;
      min-height: 360px;
      border-radius: 30px;
    }
  }
`;

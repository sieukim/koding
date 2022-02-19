import styled from 'styled-components';

export const StyledProfilePage = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 82px auto 0 auto;
  width: 900px;

  .item-container {
    display: flex;
    flex-direction: column;
    width: 435px;
    min-height: 510px;
  }

  .item-container-default {
    align-items: center;
    justify-content: center;
    padding: 30px;
    border: 1px solid #d9d9d9;
    border-radius: 10px;

    .item {
      margin-bottom: 20px;
    }

    .follow-item {
      display: flex;
      justify-content: space-evenly;
      border-bottom: 1px solid #d9d9d9;
      padding-bottom: 10px;
      width: 70%;

      & > div {
        font-size: 1rem;
      }
    }

    .user-info-item {
      display: flex;
      flex-direction: column;
      width: 70%;

      & > div:first-child {
        margin-bottom: 10px;
      }
    }
  }

  .item-container-editable {
    .url-item-blog,
    .url-item-github,
    .url-item-portfolio,
    .skill-item-skills,
    .skill-item-interests {
      border: 1px solid #d9d9d9;
      border-radius: 10px;
      padding: 15px 20px;
      margin: 10px 0;
    }

    .url-item-blog,
    .skill-item-skills {
      margin-top: 0;
    }

    .skill-item-interests {
      margin-bottom: 0;
    }

    .url-item-header,
    .skill-item-header {
      font-weight: 600;
    }

    .url-item-contents {
      margin-left: 5px;
    }

    .skill-tag,
    .interest-tag {
      margin: 5px;
    }
  }
`;

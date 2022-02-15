import styled from 'styled-components';

export const StyledHeader = styled.nav`
  display: flex;
  flex-direction: row;
  padding: 16px 32px;
  justify-content: space-between;
  align-items: center;

  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  .web-title {
    font-size: 30px;
  }

  .ant-menu-horizontal {
    border-bottom: none;
  }

  li {
    margin: auto 30px;
    font-weight: bold;
    font-size: 1rem;
    color: grey;
  }

  .login {
    width: 88px;
    text-align: right;
    font-weight: bold;
    font-size: 1rem;
  }

  .icon-groups {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: right;
    width: 176px;
    height: 32px;

    a {
      display: flex;
      align-items: center;
      margin-left: 32px;

      font-weight: bold;
      font-size: 1rem;

      .anticon-bell,
      .anticon-search {
        color: grey;
      }
    }

    .ant-dropdown-trigger {
      margin-left: 32px;
    }
  }
`;

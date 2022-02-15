import styled from 'styled-components';

export const StyledSearchByTag = styled.div`
  height: 30px;

  .tag {
    margin-bottom: 8px;
  }

  .tag-action {
    width: 78px;
    vertical-align: top;
    background: #ffff;
    border-style: dashed;

    :hover {
      cursor: pointer;
    }
  }

  .tag-visible {
    width: 78px;
    vertical-align: top;
    margin-bottom: 8px;
  }

  .tag-invisible {
    display: none;
  }
`;

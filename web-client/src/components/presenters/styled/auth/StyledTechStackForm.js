import styled from 'styled-components';

export const StyledTechStackForm = styled.div`
  .techStack-container,
  .interestTech-container {
    margin-bottom: 16px;
  }

  .tag {
    margin-bottom: 8px;
  }

  .tag-action {
    vertical-align: top;
    background: #ffff;
    border-style: dashed;

    :hover {
      cursor: pointer;
    }
  }

  .tag-action-add {
    width: 100px;
  }

  .tag-action-remove {
    width: 78px;
  }

  .tag-visible {
    width: 100px;
    vertical-align: top;
  }

  .tag-invisible {
    display: none;
  }
`;

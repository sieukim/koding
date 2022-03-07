import styled from 'styled-components';

export const StyledTags = styled.div`
  height: 30px;

  .ant-tag {
    margin-bottom: 8px;
  }

  .custom-tag {
    width: 78px;
    vertical-align: top;
    background: #ffff;
    border-style: dashed;

    :hover {
      cursor: pointer;
    }
  }

  .input-tag-visible {
    width: 78px;
    vertical-align: top;
    margin-bottom: 8px;
  }

  .input-tag-invisible {
    display: none;
  }
`;

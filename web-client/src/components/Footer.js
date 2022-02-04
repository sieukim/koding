import { Divider } from 'antd';
import styled from 'styled-components';

const StyledFooter = styled.div`
  height: 80px;

  p {
    margin: 10px 0;
    color: gray;
    text-align: center;
  }
`;
const Footer = () => {
  return (
    <StyledFooter>
      <Divider style={{ margin: '0 0', padding: '0 16px' }} />
      <p>
        Copyright © {new Date().getFullYear()} Koding.co.,Ltd. All rights
        reserved.
      </p>
    </StyledFooter>
  );
};

export default Footer;

import { Divider } from 'antd';
import { StyledFooter } from './presenters/styled/StyledFooter';

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

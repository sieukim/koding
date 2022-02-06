import { Space } from 'antd';

export const IconText = ({ icon, text, className }) => (
  <Space className={className}>
    {icon}
    {text}
  </Space>
);

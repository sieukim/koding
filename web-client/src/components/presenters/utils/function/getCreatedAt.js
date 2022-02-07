import 'moment/locale/ko';
import moment from 'moment';
import { Tooltip } from 'antd';

const getRelativeCreatedAt = (createdAt) => {
  return moment(createdAt.slice(0, 19)).fromNow();
};

const getAbsoluteCreatedAt = (createdAt) => {
  return moment(createdAt.slice(0, 19)).format('YYYY년 M월 D일 H시 m분');
};

export const getCreatedAt = (createdAt) => {
  return (
    <Tooltip title={getAbsoluteCreatedAt(createdAt)}>
      {getRelativeCreatedAt(createdAt)}
    </Tooltip>
  );
};

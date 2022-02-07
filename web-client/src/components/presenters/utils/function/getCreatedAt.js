import 'moment/locale/ko';
import moment from 'moment';

export const getRelativeCreatedAt = (createdAt) => {
  return moment(createdAt.slice(0, 19)).fromNow();
};

export const getAbsoluteCreatedAt = (createdAt) => {
  return moment(createdAt.slice(0, 19)).format('YYYY년 M월 D일 H시 M분');
};

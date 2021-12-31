import axios from 'axios';

// 회원가입 api 호출
export const signup = (user) => {
  axios.post('/api/users', user);
};

// 중복 확인 api 호출
export const duplicateCheck = (key, value) => {
  axios.head(`/api/users?key=${key}&value=${value}`);
};

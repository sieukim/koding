import axios from 'axios';

// 회원가입 api 호출
export const signup = (user) => {
  return axios.post('/api/users', user);
};

// 중복 확인 api 호출
export const duplicateCheck = (key, value) => {
  return axios.head(`/api/users?key=${key}&value=${value}`);
};

// 로그인 api 호출
export const login = (user) => {
  return axios.post(`api/auth`, user);
};

// 로그아웃 api 호출
export const logout = () => {
  return axios.delete(`api/auth`);
};

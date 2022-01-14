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
  return axios.post(`/api/auth`, user);
};

// 로그아웃 api 호출
export const logout = () => {
  return axios.delete(`/api/auth`);
};

// github 로그인 & 회원가입 api 호출
export const githubCallback = (code) => {
  return axios.get(`/api/auth/github/callback?code=${code}`);
};

// github verify api 호출
export const githubVerify = (user) => {
  return axios.post(`/api/auth/github/verify`, user);
};

// 비밀번호 초기화 token 전송 요청 api 호출
export const sendToken = (user) => {
  return axios.delete(`/api/auth/email/password`, { data: user });
};

// 비밀번호 초기화 token 검증 api 호출
export const verifyToken = (user) => {
  return axios.post(`/api/auth/email/password/verifyToken`, user);
};

// 비밀번호 초기화 api 호출
export const resetPassword = (user) => {
  return axios.post(`/api/auth/email/password`, user);
};

// 게시글 작성 api 호출
export const writePost = (boardType, post) => {
  return axios.post(`/api/posts/${boardType}`, post);
};

// 게시글 목록 갖고오기 api 호출
export const readBoard = (boardType, tags, cursor) => {
  const query = new URLSearchParams();
  if (tags && tags.length > 0) query.set('tags', tags);
  if (cursor) query.set('cursor', cursor);

  return axios.get(`/api/posts/${boardType}?${query.toString()}`);
};

// 게시글 읽기 api 호출
export const readPost = (boardType, postId) => {
  return axios.get(`/api/posts/${boardType}/${postId}`);
};

// 게시글 수정 api 호출
export const editPost = (boardType, postId, post) => {
  return axios.patch(`/api/posts/${boardType}/${postId}`, post);
};

// 게시글 삭제 api 호출
export const removePost = (boardType, postId) => {
  return axios.delete(`/api/posts/${boardType}/${postId}`);
};

// 댓글 읽기 api 호출
export const readComment = (boardType, postId) => {
  return axios.get(`/api/posts/${boardType}/${postId}/comments`);
};

// 댓글 작성 api 호출
export const writeComment = (boardType, postId, comment) => {
  return axios.post(`/api/posts/${boardType}/${postId}/comments`, comment);
};

// 댓글 수정 api 호출
export const editComment = (boardType, postId, commentId, comment) => {
  return axios.patch(
    `/api/posts/${boardType}/${postId}/comments/${commentId}`,
    comment,
  );
};

// 댓글 삭제 api 호출
export const removeComment = (boardType, postId, commentId) => {
  return axios.delete(
    `/api/posts/${boardType}/${postId}/comments/${commentId}`,
  );
};

// 팔로우 api 호출
export const follow = (loginUserNickname, followedUserNickname) => {
  return axios.post(`/api/users/${loginUserNickname}/followings`, {
    nickname: followedUserNickname,
  });
};

// 언팔로우 api 호출
export const unfollow = (loginUserNickname, unfollowedUserNickname) => {
  return axios.delete(
    `/api/users/${loginUserNickname}/followings/${unfollowedUserNickname}`,
  );
};

// 팔로잉 정보 조회 api 호출
export const getFollowing = (profileUserNickname) => {
  return axios.get(`/api/users/${profileUserNickname}/followings`);
};

// 팔로워 정보 조회 api 호출
export const getFollower = (profileUserNickname) => {
  return axios.get(`/api/users/${profileUserNickname}/followers`);
};

// 유저 팔로우 여부 조회 api 호출
export const isFollowing = (nickname, followingNickname) => {
  return axios.head(`/api/users/${nickname}/followings/${followingNickname}`);
};

// 유저 정보 조회 api 호출
export const getUser = (nickname) => {
  return axios.get(`/api/users/${nickname}`);
};

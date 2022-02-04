import axios from 'axios';

/*
 **************************
 ******** auth api ********
 **************************
 */

// 중복 확인 api 호출
export const duplicateCheck = (key, value) => {
  return axios.head(`/api/users?key=${key}&value=${value}`);
};

// 이메일 회원가입 api 호출
export const signup = (user) => {
  return axios.post('/api/users', user);
};

// 이메일 로그인 api 호출
export const login = (user) => {
  return axios.post(`/api/auth`, user);
};

// github 회원가입 api 호출
export const githubVerify = (user) => {
  return axios.post(`/api/auth/github/verify`, user);
};

// github 로그인 api 호출
export const githubCallback = (code) => {
  return axios.get(`/api/auth/github/callback?code=${code}`);
};

// 로그아웃 api 호출
export const logout = () => {
  return axios.delete(`/api/auth`);
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

// 비밀번호 변경 api 호출
export const changePassword = (user, password) => {
  return axios.patch(`/api/users/${user}/password`, password);
};

/*
 **********************************
 ********* notification api *******
 **********************************
 */

// 알림 조회 api 호출
export const getNotifications = (nickname, cursor) => {
  const query = new URLSearchParams();
  if (cursor) query.set('cursor', cursor);

  return axios.get(`/api/notifications/${nickname}?${query.toString()}`);
};

// 알림 읽기 api 호출
export const readNotification = (nickname, notificationId) => {
  return axios.patch(`/api/notifications/${nickname}/${notificationId}`, {
    read: true,
  });
};

// 전체 알림 읽기 api 호출
export const readAllNotifications = (nickname) => {
  return axios.patch(`/api/notifications/${nickname}`, { read: true });
};

// 알림 삭제 api 호출
export const removeNotification = (nickname, notificationId) => {
  return axios.delete(`/api/notifications/${nickname}/${notificationId}`);
};

// 전체 알림 삭제 api 호출
export const removeAllNotification = (nickname) => {
  return axios.delete(`/api/notifications/${nickname}`);
};

// 안 읽은 알림 여부 확인 api 호출
export const checkNotifications = (nickname) => {
  return axios.head(`/api/notifications/${nickname}?read=false`);
};

/*
 **********************************
 ************* post api ***********
 **********************************
 */

// 게시글 목록 갖고오기 api 호출
export const readBoard = (boardType, tags, cursor) => {
  const query = new URLSearchParams();
  if (tags && tags.length > 0) query.set('tags', tags);
  if (cursor) query.set('cursor', cursor);

  return axios.get(`/api/posts/${boardType}?${query.toString()}`);
};

// 게시글 작성 api 호출
export const writePost = (boardType, post) => {
  return axios.post(`/api/posts/${boardType}`, post);
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
export const readComment = (boardType, postId, cursor) => {
  const query = new URLSearchParams();
  if (cursor) query.set('cursor', cursor);

  return axios.get(
    `/api/posts/${boardType}/${postId}/comments?${query.toString()}`,
  );
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

// 태그 목록 조회 api 호출
export const getTagList = (boardType) => {
  return axios.get(`/api/tags/${boardType}`);
};

/*
 **********************************
 *********** profile api **********
 **********************************
 */

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

// 로그인 유저 정보 조회 api 호출
export const getLoginUser = () => {
  return axios.get(`/api/auth`);
};

// 유저 정보 조회 api 호출
export const getUser = (nickname) => {
  return axios.get(`/api/users/${nickname}`);
};

// 유저 정보 변경 api 호출
export const changeUserInfo = (nickname, userInfo) => {
  return axios.patch(`/api/users/${nickname}`, userInfo);
};

// 이미지 업로드 api 호출
export const uploadImage = (image) => {
  const body = new FormData();
  body.set('image', image);
  return axios.post(`/api/upload/posts`, body);
};

// 유저 탈퇴
export const revokeUser = (nickname) => {
  return axios.delete(`/api/users/${nickname}`);
};

// 유저 게시글 조회
export const getUserPosts = (nickname, boardType, cursor) => {
  const query = new URLSearchParams();
  if (cursor) query.set('cursor', cursor);

  return axios.get(
    `/api/users/${nickname}/posts/${boardType}?${query.toString()}`,
  );
};

// 유저 댓글 조회
export const getUserComments = (nickname, boardType, cursor) => {
  const query = new URLSearchParams();
  if (cursor) query.set('cursor', cursor);

  return axios.get(
    `/api/users/${nickname}/comments/${boardType}?${query.toString()}`,
  );
};

/*
 **********************************
 ************ search api **********
 **********************************
 */

// 게시글 검색(통합)
export const integratedSearch = (query) => {
  return axios.get(`/api/search/posts?query=${query}`);
};

// 게시글 검색(게시판)
export const search = (boardType, cursor, query) => {
  const queries = new URLSearchParams();
  if (cursor) queries.set('cursor', cursor);
  queries.set('query', query);

  return axios.get(`/api/search/${boardType}?${queries.toString()}`);
};

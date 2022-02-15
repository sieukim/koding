import axios from 'axios';

/*
 **************************
 ******** auth api ********
 **************************
 */

// 중복 확인
export const duplicateCheck = (key, value) => {
  return axios.head(`/api/users?key=${key}&value=${value}`);
};

// 이메일 회원가입
export const signup = (user) => {
  const formData = new FormData();

  formData.set('email', user.email);
  formData.set('nickname', user.nickname);
  formData.set('password', user.password);
  if (user.blogUrl) {
    formData.set('blogUrl', user.blogUrl);
  }
  if (user.githubUrl) {
    formData.set('githubUrl', user.githubUrl);
  }
  if (user.portfolioUrl) {
    formData.set('portfolioUrl', user.portfolioUrl);
  }
  if (user.avatar) {
    formData.set('avatar', user.avatar);
  }

  return axios.post('/api/users', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// 이메일 로그인
export const login = (user) => {
  return axios.post(`/api/auth`, user);
};

// github 회원가입
export const githubVerify = (user) => {
  return axios.post(`/api/auth/github/verify`, user);
};

// github 로그인
export const githubCallback = (code) => {
  return axios.get(`/api/auth/github/callback?code=${code}`);
};

// 로그아웃
export const logout = () => {
  return axios.delete(`/api/auth`);
};

// 비밀번호 초기화 token 전송 요청
export const sendToken = (user) => {
  return axios.delete(`/api/auth/email/password`, { data: user });
};

// 비밀번호 초기화 token 검증
export const verifyToken = (user) => {
  return axios.post(`/api/auth/email/password/verifyToken`, user);
};

// 비밀번호 초기화
export const resetPassword = (user) => {
  return axios.post(`/api/auth/email/password`, user);
};

// 비밀번호 변경
export const changePassword = (user, password) => {
  return axios.patch(`/api/users/${user}/password`, password);
};

/*
 **********************************
 ********* notification api *******
 **********************************
 */

// 알림 조회
export const getNotifications = (nickname, cursor) => {
  const query = new URLSearchParams();
  if (cursor) query.set('cursor', cursor);

  return axios.get(`/api/notifications/${nickname}?${query.toString()}`);
};

// 알림 읽기
export const readNotification = (nickname, notificationId) => {
  return axios.patch(`/api/notifications/${nickname}/${notificationId}`, {
    read: true,
  });
};

// 전체 알림 읽기
export const readAllNotifications = (nickname) => {
  return axios.patch(`/api/notifications/${nickname}`, { read: true });
};

// 알림 삭제
export const removeNotification = (nickname, notificationId) => {
  return axios.delete(`/api/notifications/${nickname}/${notificationId}`);
};

// 전체 알림 삭제
export const removeAllNotification = (nickname) => {
  return axios.delete(`/api/notifications/${nickname}`);
};

// 안 읽은 알림 여부 확인
export const checkNotifications = (nickname) => {
  return axios.head(`/api/notifications/${nickname}?read=false`);
};

/*
 **********************************
 ************* post api ***********
 **********************************
 */

// 게시글 목록 갖고오기
export const readBoard = (boardType, tags, cursor) => {
  const query = new URLSearchParams();
  if (tags && tags.length > 0) query.set('tags', tags);
  if (cursor) query.set('cursor', cursor);

  return axios.get(`/api/posts/${boardType}?${query.toString()}`);
};

// 게시글 작성
export const writePost = (boardType, post) => {
  return axios.post(`/api/posts/${boardType}`, post);
};

// 게시글 읽기
export const readPost = (boardType, postId) => {
  return axios.get(`/api/posts/${boardType}/${postId}`);
};

// 게시글 수정
export const editPost = (boardType, postId, post) => {
  return axios.patch(`/api/posts/${boardType}/${postId}`, post);
};

// 게시글 삭제
export const removePost = (boardType, postId) => {
  return axios.delete(`/api/posts/${boardType}/${postId}`);
};

// 게시글 좋아요
export const likePost = (boardType, postId, nickname) => {
  return axios.post(`/api/posts/${boardType}/${postId}/like/${nickname}`);
};

// 게시글 좋아요 취소
export const unlikePost = (boardType, postId, nickname) => {
  return axios.delete(`/api/posts/${boardType}/${postId}/like/${nickname}`);
};

// 게시글 스크랩
export const scrapPost = (boardType, postId, nickname) => {
  return axios.post(`/api/posts/${boardType}/${postId}/scrap/${nickname}`);
};

// 게시글 스크랩 취소
export const unscrapPost = (boardType, postId, nickname) => {
  return axios.delete(`/api/posts/${boardType}/${postId}/scrap/${nickname}`);
};

// 게시글 신고
export const reportPost = (boardType, postId, nickname, reportReason) => {
  return axios.post(
    `/api/posts/${boardType}/${postId}/report/${nickname}`,
    reportReason,
  );
};

// 댓글 읽기
export const readComment = (boardType, postId, cursor) => {
  const query = new URLSearchParams();
  if (cursor) query.set('cursor', cursor);

  return axios.get(
    `/api/posts/${boardType}/${postId}/comments?${query.toString()}`,
  );
};

// 댓글 작성
export const writeComment = (boardType, postId, comment) => {
  return axios.post(`/api/posts/${boardType}/${postId}/comments`, comment);
};

// 댓글 수정
export const editComment = (boardType, postId, commentId, comment) => {
  return axios.patch(
    `/api/posts/${boardType}/${postId}/comments/${commentId}`,
    comment,
  );
};

// 댓글 삭제
export const removeComment = (boardType, postId, commentId) => {
  return axios.delete(
    `/api/posts/${boardType}/${postId}/comments/${commentId}`,
  );
};

// 댓글 좋아요
export const likeComment = (boardType, postId, commentId, nickname) => {
  return axios.post(
    `/api/posts/${boardType}/${postId}/comments/${commentId}/like/${nickname}`,
  );
};

// 댓글 좋아요 취소
export const unlikeComment = (boardType, postId, commentId, nickname) => {
  return axios.delete(
    `/api/posts/${boardType}/${postId}/comments/${commentId}/like/${nickname}`,
  );
};

// 태그 목록 조회
export const getTagList = (boardType) => {
  return axios.get(`/api/tags/${boardType}`);
};

// 일일 랭킹 조회
export const getRanking = (boardType, pageSize = 5) => {
  const query = new URLSearchParams();
  if (pageSize) query.set('pageSize', pageSize);

  return axios.get(`/api/post-ranking/daily/${boardType}?pageSize=${pageSize}`);
};

/*
 **********************************
 *********** profile api **********
 **********************************
 */

// 팔로우
export const follow = (loginUserNickname, followedUserNickname) => {
  return axios.post(`/api/users/${loginUserNickname}/followings`, {
    nickname: followedUserNickname,
  });
};

// 언팔로우
export const unfollow = (loginUserNickname, unfollowedUserNickname) => {
  return axios.delete(
    `/api/users/${loginUserNickname}/followings/${unfollowedUserNickname}`,
  );
};

// 팔로잉 정보 조회
export const getFollowing = (profileUserNickname) => {
  return axios.get(`/api/users/${profileUserNickname}/followings`);
};

// 팔로워 정보 조회
export const getFollower = (profileUserNickname) => {
  return axios.get(`/api/users/${profileUserNickname}/followers`);
};

// 유저 팔로우 여부 조회
export const isFollowing = (nickname, followingNickname) => {
  return axios.head(`/api/users/${nickname}/followings/${followingNickname}`);
};

// 로그인 유저 정보 조회
export const getLoginUser = () => {
  return axios.get(`/api/auth`);
};

// 유저 정보 조회
export const getUser = (nickname) => {
  return axios.get(`/api/users/${nickname}`);
};

// 유저 정보 변경
export const changeUserInfo = (nickname, user) => {
  const formData = new FormData();

  if (user.isBlogUrlPublic !== undefined) {
    formData.set('isBlogUrlPublic', user.isBlogUrlPublic);
  }
  if (user.blogUrl) {
    formData.set('blogUrl', user.blogUrl);
  }
  if (user.isGithubUrlPublic !== undefined) {
    formData.set('isGithubUrlPublic', user.isGithubUrlPublic);
  }
  if (user.githubUrl) {
    formData.set('githubUrl', user.githubUrl);
  }
  if (user.isPortfolioUrlPublic !== undefined) {
    formData.set('isPortfolioUrlPublic', user.isPortfolioUrlPublic);
  }
  if (user.portfolioUrl) {
    formData.set('portfolioUrl', user.portfolioUrl);
  }
  if (user.avatar) {
    formData.set('avatar', user.avatar);
  }
  return axios.patch(`/api/users/${nickname}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// 프로필 사진 삭제
export const removeAvatarUrl = (nickname) => {
  return axios.delete(`/api/users/${nickname}/avatarUrl`);
};

// 이미지 업로드
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
export const search = (query) => {
  return axios.get(`/api/search/posts?query=${query}`);
};

// 닉네임 검색
export const searchUser = (cursor, nickname) => {
  const query = new URLSearchParams();
  if (cursor) query.set('cursor', cursor);
  if (nickname) query.set('nickname', nickname);

  return axios.get(`/api/search/users?${query.toString()}`);
};

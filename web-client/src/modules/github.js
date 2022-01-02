/* 액션 타입 정의 */
const GITHUB_SIGNUP = 'github/GITHUB_SIGNUP';

/* 액션 생성 함수 만들기 */
export const githubSignup = (user) => ({ type: GITHUB_SIGNUP, user });

/* 초기 상태 선언 */
const initialState = {
  user: null,
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case GITHUB_SIGNUP:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
}

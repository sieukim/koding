/* 액션 타입 정의 */
const SET_LOGIN = 'auth/SET_LOGIN';
const SET_LOGOUT = 'auth/SET_LOGOUT';
const EDIT_PROFILE = 'auth/EDIT_PROFILE';

/* 액션 생성 함수 만들기 */
export const setLogin = (user) => ({ type: SET_LOGIN, user });
export const setLogout = () => ({ type: SET_LOGOUT });
export const editProfile = (user) => ({ type: EDIT_PROFILE, user });

/* 초기 상태 선언 */
const initialState = {
  user: null,
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case SET_LOGIN:
      return {
        ...state,
        user: action.user,
      };
    case SET_LOGOUT:
      return {
        ...state,
        user: null,
      };
    case EDIT_PROFILE:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
}

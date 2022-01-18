import EditProfilePresenter from '../../presenters/profile/EditProfilePresenter';
import * as api from '../../../modules/api';
import useAsync from '../../../hooks/useAsync';

const EditProfileContainer = ({ profileNickname }) => {
  // 로그인 유저 정보 가져오기
  const [getLoginUserState] = useAsync(
    () => api.getLoginUser(),
    [profileNickname],
    false,
  );

  // 유저 정보 변경
  const [changeUserInfoState, changeUserInfoFetch] = useAsync(
    (userInfo) => api.changeUserInfo(profileNickname, userInfo),
    [profileNickname],
    true,
  );

  // 비밀번호 변경
  const [changePasswordState, changePasswordFetch] = useAsync(
    (password) => api.changePassword(profileNickname, password),
    [profileNickname],
    true,
  );

  return (
    <EditProfilePresenter
      getLoginUserState={getLoginUserState}
      getLoginUserData={getLoginUserState.success?.data}
      changeUserInfoState={changeUserInfoState}
      changeUserInfoFetch={changeUserInfoFetch}
      changePasswordState={changePasswordState}
      changePasswordFetch={changePasswordFetch}
    />
  );
};

export default EditProfileContainer;

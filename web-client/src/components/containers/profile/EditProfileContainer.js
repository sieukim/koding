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

  // 유저 탈퇴
  const [revokeState, revokeFetch] = useAsync(
    (nickname) => api.revokeUser(nickname),
    [],
    true,
  );

  return (
    <EditProfilePresenter
      getLoginUserState={getLoginUserState}
      getLoginUserData={getLoginUserState.success?.data}
      changeUserInfoState={changeUserInfoState}
      changeUserInfoFetch={changeUserInfoFetch}
      revokeState={revokeState}
      revokeFetch={revokeFetch}
    />
  );
};

export default EditProfileContainer;

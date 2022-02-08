import EditProfilePresenter from '../../presenters/profile/EditProfilePresenter';
import * as api from '../../../modules/api';
import useAsync from '../../../hooks/useAsync';
import { useDispatch, useSelector } from 'react-redux';
import { editProfile } from '../../../modules/auth';
import { useCallback } from 'react';

const EditProfileContainer = ({ profileNickname }) => {
  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  // 유저 정보 변경
  const [changeUserInfoState, changeUserInfoFetch] = useAsync(
    async (userInfo) => {
      const response = await api.changeUserInfo(profileNickname, userInfo);
      dispatch(editProfile(response.data));
    },
    [profileNickname, dispatch],
    true,
  );

  // 유저 탈퇴
  const [revokeState, revokeFetch] = useAsync(
    (nickname) => api.revokeUser(nickname),
    [],
    true,
  );

  // 프로필 사진 삭제
  const removeAvatarUrl = useCallback(
    () => api.removeAvatarUrl(user.nickname),
    [user],
  );

  return (
    <EditProfilePresenter
      user={user ?? {}}
      changeUserInfoState={changeUserInfoState}
      changeUserInfoFetch={changeUserInfoFetch}
      revokeState={revokeState}
      revokeFetch={revokeFetch}
      removeAvatarUrl={removeAvatarUrl}
    />
  );
};

export default EditProfileContainer;

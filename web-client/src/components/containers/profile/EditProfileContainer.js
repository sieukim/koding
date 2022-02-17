import EditProfilePresenter from '../../presenters/profile/EditProfilePresenter';
import * as api from '../../../modules/api';
import useAsync from '../../../hooks/useAsync';
import { useDispatch } from 'react-redux';
import { editProfile, setLogout } from '../../../modules/auth';
import { useCallback, useEffect } from 'react';
import { useMessage } from '../../../hooks/useMessage';
import { useNavigate } from 'react-router-dom';

const EditProfileContainer = ({ user }) => {
  // 전역 상태
  const dispatch = useDispatch();
  // 로그아웃
  // eslint-disable-next-line
  const logout = useCallback(() => dispatch(setLogout()), [setLogout]);
  // navigate
  const navigate = useNavigate();

  // 유저 정보 변경
  const [changeUserState, changeUserFetch] = useAsync(
    async (userInfo) => {
      const response = await api.changeUserInfo(user.nickname, userInfo);
      dispatch(editProfile(response.data));
    },
    // eslint-disable-next-line
    [user],
    true,
  );

  // message
  useMessage(changeUserState, '멋진 프로필이네요! 🤩');

  // 유저 탈퇴
  const [revokeUserState, revokeUserFetch] = useAsync(
    () => api.revokeUser(user.nickname),
    [user],
    true,
  );

  useEffect(() => {
    if (revokeUserState.success) {
      logout();
      navigate('/');
    }
  }, [revokeUserState, logout, navigate]);

  // message
  useMessage(revokeUserState, '다음에 또 만나요 🥺');

  // 프로필 사진 삭제
  const removeAvatar = useCallback(
    () => api.removeAvatarUrl(user.nickname),
    [user],
  );

  // 비밀번호 변경
  const onClickChangePwd = useCallback(() => {
    navigate('/reset-password');
  }, [navigate]);

  return (
    <EditProfilePresenter
      user={user ?? {}}
      changeUserLoading={changeUserState.loading}
      revokeUserLoading={revokeUserState.loading}
      onClickChangeUser={changeUserFetch}
      onClickRevokeUser={revokeUserFetch}
      onClickRemoveAvatar={removeAvatar}
      onClickChangePwd={onClickChangePwd}
    />
  );
};

export default EditProfileContainer;

import { useCallback, useEffect, useState } from 'react';
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import { AvatarForm } from '../utils/auth/AvatarForm';
import { StyledTitle } from '../styled/StyledTitle';
import { StyledEditProfilePage } from '../styled/profile/StyledEditProfilePage';
import { EditProfileForm } from '../utils/profile/EditProfileForm';

const EditProfilePresenter = ({
  user,
  changeUserLoading,
  revokeUserLoading,
  onClickChangeUser,
  onClickRevokeUser,
  onClickRemoveAvatar,
  onClickChangePwd,
}) => {
  // 프로필 사진
  const [avatarFile, setAvatarFile] = useState(null);

  // 보유 기술
  const [techStack, setTechStack] = useState([]);

  // 관심 분야
  const [interestTech, setInterestTech] = useState([]);

  useEffect(() => {
    if (user) {
      setTechStack(user.techStack);
      setInterestTech(user.interestTech);
    }
  }, [user]);

  // 프로필 편집 버튼 onFinish(onSubmit) 핸들러
  const onFinish = useCallback(
    (values) => {
      onClickChangeUser({
        ...values,
        avatar: avatarFile,
        techStack,
        interestTech,
      });
    },
    [onClickChangeUser, avatarFile, techStack, interestTech],
  );

  return (
    <StyledEditProfilePage>
      <StyledTitle>프로필</StyledTitle>
      <AvatarForm
        defaultAvatarUrl={user.avatarUrl}
        setAvatarFile={setAvatarFile}
        onClickRemoveAvatar={onClickRemoveAvatar}
      />
      <div className="default-value-container">
        <UserOutlined className="default-value-icon" />
        {user.nickname}
      </div>
      <div className="default-value-container">
        <MailOutlined className="default-value-icon" />
        {user.email}
      </div>
      <EditProfileForm
        user={user}
        changeUserLoading={changeUserLoading}
        revokeUserLoading={revokeUserLoading}
        onClickRevokeUser={onClickRevokeUser}
        onClickChangePwd={onClickChangePwd}
        techStack={techStack}
        setTechStack={setTechStack}
        interestTech={interestTech}
        setInterestTech={setInterestTech}
        onFinish={onFinish}
      />
    </StyledEditProfilePage>
  );
};

export default EditProfilePresenter;

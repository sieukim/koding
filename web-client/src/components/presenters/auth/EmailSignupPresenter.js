import { useCallback, useState } from 'react';
import { AvatarForm } from '../utils/auth/AvatarForm';
import { StyledTitle } from '../styled/StyledTitle';
import { SignupForm } from '../utils/auth/SignupForm';
import { StyledAuthPage } from '../styled/auth/StyledAuthPage';

const EmailSignupPresenter = ({
  loading,
  onSignup,
  duplicated,
  checked,
  onDuplicateCheck,
}) => {
  // 프로필 사진
  const [avatarFile, setAvatarFile] = useState(null);

  // 회원가입 Form onFinish(onSubmit) 핸들러
  const onFinish = useCallback(
    (values) => {
      onSignup({ ...values, avatar: avatarFile });
    },
    [onSignup, avatarFile],
  );

  return (
    <StyledAuthPage width="450px">
      <StyledTitle>회원가입</StyledTitle>
      <AvatarForm setAvatarFile={setAvatarFile} />
      <SignupForm
        loading={loading}
        onFinish={onFinish}
        duplicated={duplicated}
        checked={checked}
        onDuplicateCheck={onDuplicateCheck}
      />
    </StyledAuthPage>
  );
};

export default EmailSignupPresenter;

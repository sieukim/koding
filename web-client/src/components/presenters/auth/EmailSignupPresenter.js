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
  sendLoading,
  sendData,
  sendError,
  verifyLoading,
  verifyData,
  verifyError,
  onSendToken,
  onVerifyToken,
  initializeState,
}) => {
  // 프로필 사진
  const [avatarFile, setAvatarFile] = useState(null);

  // 보유 기술
  const [techStack, setTechStack] = useState([]);

  // 관심 분야
  const [interestTech, setInterestTech] = useState([]);

  // 회원가입 Form onFinish(onSubmit) 핸들러
  const onFinish = useCallback(
    (values) => {
      onSignup({
        ...values,
        avatar: avatarFile,
        techStack,
        interestTech,
      });
    },
    [onSignup, avatarFile, techStack, interestTech],
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
        techStack={techStack}
        setTechStack={setTechStack}
        interestTech={interestTech}
        setInterestTech={setInterestTech}
        sendLoading={sendLoading}
        sendData={sendData}
        sendError={sendError}
        verifyLoading={verifyLoading}
        verifyData={verifyData}
        verifyError={verifyError}
        onSendToken={onSendToken}
        onVerifyToken={onVerifyToken}
        initializeState={initializeState}
      />
    </StyledAuthPage>
  );
};

export default EmailSignupPresenter;

import { useCallback, useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { LinkOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { AvatarForm } from '../utils/auth/AvatarForm';
import { StyledTitle } from '../styled/StyledTitle';
import { StyledEditProfilePage } from '../styled/profile/StyledEditProfilePage';

const EditProfilePresenter = ({
  user,
  changeUserLoading,
  revokeUserLoading,
  onClickChangeUser,
  onClickRevokeUser,
  onClickRemoveAvatar,
  onClickChangePwd,
}) => {
  // profile 변경 form
  const [profileForm] = Form.useForm();

  useEffect(() => {
    profileForm.setFieldsValue({
      blogUrl: user.blogUrl,
      githubUrl: user.githubUrl,
      portfolioUrl: user.portfolioUrl,
      isBlogUrlPublic: user.isBlogUrlPublic,
      isGithubUrlPublic: user.isGithubUrlPublic,
      isPortfolioUrlPublic: user.isPortfolioUrlPublic,
    });
  }, [user, profileForm]);

  // 프로필 사진
  const [avatarFile, setAvatarFile] = useState(null);

  // 프로필 편집 버튼 onFinish(onSubmit) 핸들러
  const onFinishEditProfile = useCallback(
    (values) => {
      onClickChangeUser({ ...values, avatar: avatarFile });
    },
    [onClickChangeUser, avatarFile],
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
      <Form
        name="edit-profile-form"
        form={profileForm}
        onFinish={onFinishEditProfile}
        className="edit-profile-form"
      >
        <div className="variable-value-container">
          <Form.Item
            name="blogUrl"
            rules={[
              { required: false },
              {
                type: 'url',
                message: '올바른 주소 형식이 아닙니다. ex) https://blog.com',
              },
            ]}
            className="variable-value-url"
          >
            <Input
              prefix={<LinkOutlined className="site-form-item-icon" />}
              placeholder="블로그 주소(선택)"
              allowClear={true}
            />
          </Form.Item>
          <Form.Item
            name="isBlogUrlPublic"
            valuePropName="checked"
            className="variable-value-checkbox"
          >
            <Checkbox>공개</Checkbox>
          </Form.Item>
        </div>
        <div className="variable-value-container">
          <Form.Item
            name="githubUrl"
            rules={[
              { required: false },
              {
                type: 'url',
                message: '올바른 주소 형식이 아닙니다. ex) https://github.com',
              },
            ]}
            className="variable-value-url"
          >
            <Input
              prefix={<LinkOutlined className="site-form-item-icon" />}
              placeholder="깃허브 주소(선택)"
              allowClear={true}
            />
          </Form.Item>
          <Form.Item
            name="isGithubUrlPublic"
            valuePropName="checked"
            className="variable-value-checkbox"
          >
            <Checkbox>공개</Checkbox>
          </Form.Item>
        </div>
        <div className="variable-value-container ">
          <Form.Item
            name="portfolioUrl"
            rules={[
              { required: false },
              {
                type: 'url',
                message:
                  '올바른 주소 형식이 아닙니다. ex) https://portfolio.com',
              },
            ]}
            className="variable-value-url"
          >
            <Input
              prefix={<LinkOutlined className="site-form-item-icon" />}
              placeholder="포트폴리오 주소(선택)"
              allowClear={true}
            />
          </Form.Item>
          <Form.Item
            name="isPortfolioUrlPublic"
            valuePropName="checked"
            className="variable-value-checkbox"
          >
            <Checkbox>공개</Checkbox>
          </Form.Item>
        </div>
        <Button
          type="primary"
          htmlType="submit"
          loading={changeUserLoading}
          className="button button-action"
        >
          편집
        </Button>
      </Form>
      {user.isEmailUser && (
        <Button
          type="primary"
          onClick={onClickChangePwd}
          className="button button-action"
        >
          비밀번호 변경
        </Button>
      )}
      <Button
        type="primary"
        onClick={onClickRevokeUser}
        loading={revokeUserLoading}
        className="button button-action"
      >
        탈퇴
      </Button>
    </StyledEditProfilePage>
  );
};

export default EditProfilePresenter;

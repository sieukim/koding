import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogout } from '../../../modules/auth';
import { Button, Checkbox, Form, Input } from 'antd';
import { LinkOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { useMessage } from '../../../hooks/useMessage';
import { AvatarForm } from '../utils/profile/AvatarForm';

const StyledEditProfile = styled.div`
  .title-text {
    text-align: center;
    font-weight: bold;
    font-size: 32px;
    margin: 24px 0;
  }

  .nothing,
  .edit-profile-form,
  .edit-password-form {
    max-width: 500px;
    min-width: 350px;
  }

  .edit-profile-button,
  .edit-password-button,
  .revoke-button {
    width: 100%;
    margin-bottom: 24px;
  }

  .url-container {
    display: flex;
    justify-content: space-between;
  }

  .url {
    width: 80%;
  }

  .text {
    text-align: center;
    font-weight: bold;
  }
`;

const EditProfilePresenter = ({
  user,
  changeUserInfoState,
  changeUserInfoFetch,
  revokeState,
  revokeFetch,
  removeAvatarUrl,
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
      changeUserInfoFetch({ ...values, avatar: avatarFile });
    },
    [changeUserInfoFetch, avatarFile],
  );

  // 탈퇴
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 로그아웃
  const logout = useCallback(() => dispatch(setLogout()), [setLogout]);

  // 탈퇴 버튼 onClick 핸들러
  const onClickRevoke = useCallback(() => {
    revokeFetch(user.nickname);
  }, [revokeFetch, user]);

  useEffect(() => {
    if (revokeState.success) {
      logout();
      navigate('/');
    }
  }, [logout, navigate, revokeState.success]);

  // message
  useMessage(changeUserInfoState, '멋진 프로필이네요! 🤩');
  useMessage(revokeState, '다음에 또 만나요 🥺');

  return (
    <StyledEditProfile>
      <div className="title-text">프로필</div>

      <AvatarForm
        defaultAvatarUrl={user.avatarUrl}
        setAvatarFile={setAvatarFile}
        removeAvatarUrl={removeAvatarUrl}
      />

      <Form className="nothing">
        <Form.Item>
          <span className="ant-input-affix-wrapper">
            <UserOutlined className="site-form-item-icon ant-input-prefix" />
            {user.nickname}
          </span>
        </Form.Item>

        <Form.Item>
          <span className="ant-input-affix-wrapper">
            <MailOutlined className="site-form-item-icon ant-input-prefix" />
            {user.email}
          </span>
        </Form.Item>
      </Form>

      <Form
        name="edit-profile-form"
        form={profileForm}
        className="edit-profile-form"
        onFinish={onFinishEditProfile}
      >
        <div className="url-container">
          <Form.Item
            name="blogUrl"
            rules={[
              { required: false },
              {
                type: 'url',
                message: '올바른 주소 형식이 아닙니다. ex) https://blog.com',
              },
            ]}
            className="url"
          >
            <Input
              prefix={<LinkOutlined className="site-form-item-icon" />}
              placeholder="블로그 주소(선택)"
              allowClear={true}
            />
          </Form.Item>

          <Form.Item name="isBlogUrlPublic" valuePropName="checked">
            <Checkbox>공개</Checkbox>
          </Form.Item>
        </div>

        <div className="url-container">
          <Form.Item
            name="githubUrl"
            rules={[
              { required: false },
              {
                type: 'url',
                message: '올바른 주소 형식이 아닙니다. ex) https://github.com',
              },
            ]}
            className="url"
          >
            <Input
              prefix={<LinkOutlined className="site-form-item-icon" />}
              placeholder="깃허브 주소(선택)"
              allowClear={true}
            />
          </Form.Item>

          <Form.Item name="isGithubUrlPublic" valuePropName="checked">
            <Checkbox>공개</Checkbox>
          </Form.Item>
        </div>

        <div className="url-container">
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
            className="url"
          >
            <Input
              prefix={<LinkOutlined className="site-form-item-icon" />}
              placeholder="포트폴리오 주소(선택)"
              allowClear={true}
            />
          </Form.Item>

          <Form.Item name="isPortfolioUrlPublic" valuePropName="checked">
            <Checkbox>공개</Checkbox>
          </Form.Item>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          className="edit-profile-button"
          loading={changeUserInfoState.loading}
        >
          편집
        </Button>
      </Form>

      {user.isEmailUser && (
        <Button type="primary" className="edit-password-button">
          <NavLink to="/reset-password">비밀번호 변경</NavLink>
        </Button>
      )}

      <Button
        type="primary"
        className="revoke-button"
        onClick={onClickRevoke}
        loading={revokeState.loading}
      >
        탈퇴
      </Button>
    </StyledEditProfile>
  );
};

export default EditProfilePresenter;

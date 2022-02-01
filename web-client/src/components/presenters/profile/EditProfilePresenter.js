import styled from 'styled-components';
import { useCallback, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogout } from '../../../modules/auth';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { LinkOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';

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
  getLoginUserData = {},
  changeUserInfoState,
  changeUserInfoFetch,
  revokeState,
  revokeFetch,
}) => {
  // profile 변경 form
  const [profileForm] = Form.useForm();

  useEffect(() => {
    profileForm.setFieldsValue({
      blogUrl: getLoginUserData.blogUrl,
      githubUrl: getLoginUserData.githubUrl,
      portfolioUrl: getLoginUserData.portfolioUrl,
      isBlogUrlPublic: getLoginUserData.isBlogUrlPublic,
      isGithubUrlPublic: getLoginUserData.isGithubUrlPublic,
      isPortfolioUrlPublic: getLoginUserData.isPortfolioUrlPublic,
    });
  }, [getLoginUserData, profileForm]);

  // 프로필 편집 버튼 onFinish(onSubmit) 핸들러
  const onFinishEditProfile = useCallback(
    (values) => {
      changeUserInfoFetch({ ...values });
    },
    [changeUserInfoFetch],
  );

  // 탈퇴
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 로그아웃
  const logout = useCallback(() => dispatch(setLogout()), [setLogout]);

  // 탈퇴 버튼 onClick 핸들러
  const onClickRevoke = useCallback(() => {
    revokeFetch(getLoginUserData.nickname);
  }, [revokeFetch, getLoginUserData]);

  useEffect(() => {
    if (revokeState.success) {
      logout();
      navigate('/');
    }
  }, [logout, navigate, revokeState.success]);

  // message
  useEffect(() => {
    if (changeUserInfoState.success) {
      message.success('프로필이 변경되었습니다.');
    }
    if (changeUserInfoState.error || revokeState.error) {
      message.error('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  });

  return (
    <StyledEditProfile>
      <div className="title-text">프로필</div>
      <Form
        className="nothing"
        initialValues={{
          blogUrl: getLoginUserData.blogUrl,
          githubUrl: getLoginUserData.githubUrl,
          portfolioUrl: getLoginUserData.portfolioUrl,
          isBlogUrlPublic: getLoginUserData.isBlogUrlPublic,
          isGithubUrlPublic: getLoginUserData.isGithubUrlPublic,
          isPortfolioUrlPublic: getLoginUserData.isPortfolioUrlPublic,
        }}
      >
        <Form.Item>
          <span className="ant-input-affix-wrapper">
            <UserOutlined className="site-form-item-icon ant-input-prefix" />
            {getLoginUserData.nickname}
          </span>
        </Form.Item>

        <Form.Item>
          <span className="ant-input-affix-wrapper">
            <MailOutlined className="site-form-item-icon ant-input-prefix" />
            {getLoginUserData.email}
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

      {getLoginUserData.isEmailUser && (
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

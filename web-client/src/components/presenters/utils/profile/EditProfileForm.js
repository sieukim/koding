import { Button, Checkbox, Form, Input } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { TechStackForm } from '../auth/TechStackForm';

export const EditProfileForm = ({
  user,
  changeUserLoading,
  revokeUserLoading,
  onClickRevokeUser,
  onClickChangePwd,
  techStack,
  setTechStack,
  interestTech,
  setInterestTech,
  onFinish,
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

  return (
    <Form
      name="edit-profile-form"
      form={profileForm}
      onFinish={onFinish}
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
              message: '올바른 주소 형식이 아닙니다. ex) https://portfolio.com',
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
      <TechStackForm
        techStack={techStack}
        setTechStack={setTechStack}
        interestTech={interestTech}
        setInterestTech={setInterestTech}
      />
      <Button
        type="primary"
        htmlType="submit"
        loading={changeUserLoading}
        className="button button-action"
      >
        편집
      </Button>
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
    </Form>
  );
};

import { useCallback } from 'react';
import { Button, Form, Input } from 'antd';
import {
  ContactsOutlined,
  GithubOutlined,
  LockOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { StyledTitle } from '../styled/StyledTitle';
import { StyledAuthPage } from '../styled/auth/StyledAuthPage';

const EmailLoginPresenter = ({ loading, onLogin, githubLoginUrl }) => {
  // 로그인 Form onFinish(onSubmit) 핸들러
  const onFinish = useCallback(
    (values) => {
      onLogin(values);
    },
    [onLogin],
  );

  return (
    <StyledAuthPage width="250px">
      <StyledTitle>로그인</StyledTitle>
      <Form name="login-form" onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[{ required: true, message: '이메일을 입력하세요.' }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="이메일"
            allowClear={true}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '비밀번호를 입력하세요.' }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="비밀번호"
            allowClear={true}
          />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="button button-action"
        >
          로그인
        </Button>
        <Button
          type="primary"
          href={githubLoginUrl}
          icon={<GithubOutlined />}
          className="button button-action"
        >
          깃허브 로그인
        </Button>
        <div className="button-container">
          <Button
            type="link"
            href="/signup"
            icon={<ContactsOutlined />}
            className="button button-link"
          >
            회원가입
          </Button>
          <Button
            type="link"
            href="/reset-password"
            icon={<SearchOutlined />}
            className="button button-link"
          >
            비밀번호 찾기
          </Button>
        </div>
      </Form>
    </StyledAuthPage>
  );
};

export default EmailLoginPresenter;

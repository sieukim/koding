import { useCallback } from 'react';
import { Button, Form, Input } from 'antd';
import {
  ContactsOutlined,
  GithubOutlined,
  LockOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import styled from 'styled-components';

const StyledForm = styled.div`
  .title-text {
    text-align: center;
    font-weight: bold;
    font-size: 32px;
    margin: 24px 0;
  }

  .login-form {
    max-width: 300px;
  }

  .login-form-navLink {
    display: flex;
    justify-content: center;
  }

  .login-form-button {
    width: 100%;
  }
`;

const LoginPresenter = ({ login, loginState, url }) => {
  // 로그인 Form onFinish(onSubmit) 핸들러
  const onFinish = useCallback(
    (values) => {
      login({ ...values });
    },
    [login],
  );

  return (
    <StyledForm>
      <div className="title-text">로그인</div>
      <Form name="login-form" className="login-form" onFinish={onFinish}>
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

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={loginState.loading}
          >
            로그인
          </Button>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            href={url}
            icon={<GithubOutlined />}
            className="login-form-button"
          >
            깃허브 로그인
          </Button>
        </Form.Item>

        <Form.Item>
          <div className="login-form-navLink">
            <Button type="link" href="/signup" icon={<ContactsOutlined />}>
              회원가입
            </Button>
            <Button
              type="link"
              href="/reset-password"
              icon={<SearchOutlined />}
            >
              비밀번호 찾기
            </Button>
          </div>
        </Form.Item>
      </Form>
    </StyledForm>
  );
};

export default LoginPresenter;

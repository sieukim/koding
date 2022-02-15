import { useCallback, useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import {
  LinkOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';

export const SignupForm = ({
  loading,
  onFinish,
  duplicated,
  checked,
  onDuplicateCheck,
}) => {
  const [form] = Form.useForm();
  const [validated, setValidated] = useState({ email: false, nickname: false });

  // 이메일
  const email = form.getFieldValue('email');

  // 이메일 onChange 핸들러
  const onChangeEmail = useCallback(
    (e) => {
      onDuplicateCheck('email', e.target.value);
    },
    [onDuplicateCheck],
  );

  useEffect(() => {
    if (checked.email && duplicated.email) {
      setValidated((validated) => ({ ...validated, email: false }));
    } else {
      setValidated((validated) => ({ ...validated, email: true }));
    }
  }, [checked.email, duplicated.email, email]);

  useEffect(() => {
    if (checked.email) {
      form.validateFields(['email']);
    }
  }, [checked.email, validated.email, form]);

  // 이메일 유효성 검증
  const validateEmail = useCallback(() => {
    if (validated.email) return Promise.resolve();

    if (!validated.email) {
      return Promise.reject(new Error('사용중인 이메일입니다.'));
    }
  }, [validated.email]);

  // 비밀번호 유효성 검증
  const validatePassword = useCallback((_, value) => {
    if (!value) return Promise.reject();

    if (value.length < 8 || value.length > 16) {
      return Promise.reject(
        new Error('8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.'),
      );
    }

    return Promise.resolve();
  }, []);

  // 비밀번호 동일성 검증
  const validatePasswordCheck = useCallback(
    (_, value) => {
      if (!value) return Promise.reject();

      if (value.length < 8 || value.length > 16) {
        return Promise.reject();
      }

      if (form.getFieldValue('password') !== value) {
        return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
      }

      return Promise.resolve();
    },
    [form],
  );

  // 닉네임
  const nickname = form.getFieldValue('nickname');

  // 닉네임 onChange 핸들러
  const onChangeNickname = useCallback(
    (e) => {
      onDuplicateCheck('nickname', e.target.value);
    },
    [onDuplicateCheck],
  );

  useEffect(() => {
    if (checked.nickname && duplicated.nickname) {
      setValidated((validated) => ({ ...validated, nickname: false }));
    } else {
      setValidated((validated) => ({ ...validated, nickname: true }));
    }
  }, [checked.nickname, duplicated.nickname, nickname]);

  useEffect(() => {
    if (checked.nickname) {
      form.validateFields(['nickname']);
    }
  }, [checked.nickname, validated.nickname, form]);

  // 닉네임 유효성 검증
  const validateNickname = useCallback(
    (_, value) => {
      if (!value) return Promise.reject();

      if (
        value.length < 2 ||
        value.length > 10 ||
        /^[A-Za-z0-9가-힣]{2, 10}/.test(value)
      ) {
        return Promise.reject(
          new Error('2~10자 영문 대 소문자, 숫자, 한글을 사용하세요.'),
        );
      }

      if (validated.nickname) return Promise.resolve();

      if (!validated.nickname) {
        return Promise.reject(new Error('사용중인 닉네임입니다.'));
      }

      return Promise.resolve();
    },
    [validated.nickname],
  );

  return (
    <Form name="signup-form" form={form} onFinish={onFinish}>
      <Form.Item
        name="email"
        hasFeedback
        rules={[
          { required: true, message: '이메일을 입력하세요.' },
          { type: 'email', message: '이메일을 입력하세요.' },
          { validator: validateEmail },
        ]}
      >
        <Input
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder="이메일"
          onChange={onChangeEmail}
          allowClear={true}
        />
      </Form.Item>
      <Form.Item
        name="password"
        hasFeedback
        rules={[
          { required: true, message: '비밀번호를 입력하세요.' },
          { validator: validatePassword },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="비밀번호"
          allowClear={true}
        />
      </Form.Item>
      <Form.Item
        name="password-check"
        hasFeedback
        rules={[
          { required: true, message: '필수 정보입니다.' },
          { validator: validatePasswordCheck },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="비밀번호 재확인"
          allowClear={true}
        />
      </Form.Item>
      <Form.Item
        name="nickname"
        hasFeedback
        rules={[
          { required: true, message: '닉네임을 입력하세요.' },
          { validator: validateNickname },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="닉네임"
          onChange={onChangeNickname}
          allowClear={true}
        />
      </Form.Item>
      <Form.Item
        name="blog"
        rules={[
          { required: false },
          {
            type: 'url',
            message: '올바른 주소 형식이 아닙니다. ex) https://blog.com',
          },
        ]}
      >
        <Input
          prefix={<LinkOutlined className="site-form-item-icon" />}
          placeholder="블로그 주소(선택)"
          allowClear={true}
        />
      </Form.Item>
      <Form.Item
        name="github"
        rules={[
          { required: false },
          {
            type: 'url',
            message: '올바른 주소 형식이 아닙니다. ex) https://github.com',
          },
        ]}
      >
        <Input
          prefix={<LinkOutlined className="site-form-item-icon" />}
          placeholder="깃허브 주소(선택)"
          allowClear={true}
        />
      </Form.Item>
      <Form.Item
        name="portfolio"
        rules={[
          { required: false },
          {
            type: 'url',
            message: '올바른 주소 형식이 아닙니다. ex) https://portfolio.com',
          },
        ]}
      >
        <Input
          prefix={<LinkOutlined className="site-form-item-icon" />}
          placeholder="포트폴리오 주소(선택)"
          allowClear={true}
        />
      </Form.Item>
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        className="button button-action"
      >
        회원가입
      </Button>
    </Form>
  );
};

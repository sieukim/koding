import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row } from 'antd';
import { KeyOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const StyledResetPassword = styled.div`
  .title-text {
    text-align: center;
    font-weight: bold;
    font-size: 32px;
    margin: 24px 0;
  }

  .reset-password-form {
    max-width: 500px;
    min-width: 350px;
  }

  .reset-password-form-button {
    width: 100%;
  }
`;

const ResetPasswordPresenter = ({
  sendToken,
  sendState,
  verifyToken,
  verifyState,
  resetPassword,
  resetState,
  initializeState,
}) => {
  const [form] = Form.useForm();

  // 비밀번호 초기화 Form onFinish(onSubmit) 핸들러
  const onFinish = useCallback(
    (values) => {
      resetPassword({ ...values });
    },
    [resetPassword],
  );

  const [sent, setSent] = useState(false);

  // 인증 코드 발송 버튼 onClick 이벤트 핸들러
  const onClickSend = useCallback(() => {
    const email = form.getFieldValue('email');
    sendToken({ email: email });
    setSent(true);
  }, [sendToken, form]);

  // 인증 코드 발송 상태 초기화 이벤트 핸들러
  const onChangeMail = useCallback(() => {
    initializeState();
    setSent(false);
  }, [initializeState]);

  // 이메일 유효성 검증
  const validateEmail = useCallback(() => {
    if (sendState.error) {
      return Promise.reject(new Error('유효한 이메일이 아닙니다.'));
    }

    if (!sent && !sendState.success) {
      return Promise.reject(new Error('인증 코드 발송이 필요합니다.'));
    }

    return Promise.resolve();
  }, [sent, sendState]);

  const [checked, setChecked] = useState(false);

  // 인증 코드 확인 버튼 onClick 이벤트 핸들러
  const onClickVerify = useCallback(() => {
    const { email, verifyToken: token } = form.getFieldsValue([
      'email',
      'verifyToken',
    ]);
    verifyToken({ email: email, verifyToken: token });
    setChecked(true);
  }, [verifyToken, form]);

  // 인증 코드 유효성 검증
  const validateToken = useCallback(
    (_, value) => {
      if (!value || value.length !== 6) return Promise.reject();

      if (verifyState.error) {
        return Promise.reject(new Error('인증번호가 일치하지 않습니다.'));
      }

      if (!checked && !verifyState.success) {
        return Promise.reject(new Error('인증 코드 확인이 필요합니다.'));
      }

      return Promise.resolve();
    },
    [checked, verifyState],
  );

  useEffect(() => {
    if (sent) {
      form.validateFields(['email']);
    }
    if (checked) {
      form.validateFields(['verifyToken']);
    }
  }, [sent, checked, form, sendState.error, verifyState.error]);

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
  const validatePasswordCheck = useCallback((_, value) => {
    if (!value) return Promise.reject();

    if (value.length < 8 || value.length > 16) {
      return Promise.reject();
    }

    if (form.getFieldValue('password') !== value) {
      return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
    }

    return Promise.resolve();
  }, []);

  return (
    <StyledResetPassword>
      <div className="title-text">비밀번호 변경</div>

      <Form
        name="reset-password-form"
        form={form}
        className="reset-password-form"
        onFinish={onFinish}
      >
        <Row gutter={8}>
          <Col flex={3}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '이메일을 입력하세요.' },
                { type: 'email', message: '이메일을 입력하세요.' },
                { validator: validateEmail },
              ]}
              hasFeedback
              validateFirst={true}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="이메일"
                onChange={onChangeMail}
                allowClear={true}
              />
            </Form.Item>
          </Col>
          <Col flex={1}>
            <Button onClick={onClickSend} loading={sendState.loading}>
              인증 코드 발송
            </Button>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col flex={3}>
            <Form.Item
              name="verifyToken"
              rules={[
                { required: true, message: '인증 코드를 입력하세요.' },
                { validator: validateToken },
              ]}
              hasFeedback
            >
              <Input
                prefix={<KeyOutlined className="site-form-item-icon" />}
                placeholder="인증 코드"
                allowClear={true}
              />
            </Form.Item>
          </Col>
          <Col flex={1}>
            <Button onClick={onClickVerify} loading={verifyState.loading}>
              인증 코드 확인
            </Button>
          </Col>
        </Row>

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

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="reset-password-form-button"
            loading={resetState.loading}
          >
            비밀번호 변경
          </Button>
        </Form.Item>
      </Form>
    </StyledResetPassword>
  );
};
export default ResetPasswordPresenter;

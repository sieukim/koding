import { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row } from 'antd';
import { KeyOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { StyledTitle } from '../styled/StyledTitle';
import { StyledAuthPage } from '../styled/auth/StyledAuthPage';

const ResetPasswordPresenter = ({
  sendLoading,
  sendData,
  sendError,
  verifyLoading,
  verifyData,
  verifyError,
  resetLoading,
  onSendToken,
  onVerifyToken,
  onResetPassword,
  initializeState,
}) => {
  const [form] = Form.useForm();

  // 발송 상태
  const [sent, setSent] = useState(false);

  // 비밀번호 초기화 Form onFinish(onSubmit) 핸들러
  const onFinish = useCallback(
    (values) => onResetPassword({ ...values }),
    [onResetPassword],
  );

  // 인증 코드 발송 버튼 onClick 이벤트 핸들러
  const onClickSend = useCallback(() => {
    const email = form.getFieldValue('email');
    onSendToken({ email: email });
    setSent(true);
  }, [onSendToken, form]);

  // 인증 코드 발송 상태 초기화 이벤트 핸들러
  const onChangeMail = useCallback(() => {
    initializeState();
    setSent(false);
  }, [initializeState]);

  // 이메일 유효성 검증
  const validateEmail = useCallback(() => {
    if (sendError) {
      return Promise.reject(new Error('유효한 이메일이 아닙니다.'));
    }

    if (!sent && !sendData) {
      return Promise.reject(new Error('인증 코드 발송이 필요합니다.'));
    }

    return Promise.resolve();
  }, [sent, sendError, sendData]);

  const [checked, setChecked] = useState(false);

  // 인증 코드 확인 버튼 onClick 이벤트 핸들러
  const onClickVerify = useCallback(() => {
    const { email, verifyToken: token } = form.getFieldsValue([
      'email',
      'verifyToken',
    ]);
    onVerifyToken({ email: email, verifyToken: token });
    setChecked(true);
  }, [onVerifyToken, form]);

  // 인증 코드 유효성 검증
  const validateToken = useCallback(
    (_, value) => {
      if (!value || value.length !== 6) return Promise.reject();

      if (verifyError) {
        return Promise.reject(new Error('인증번호가 일치하지 않습니다.'));
      }

      if (!checked && !verifyData) {
        return Promise.reject(new Error('인증 코드 확인이 필요합니다.'));
      }

      return Promise.resolve();
    },
    [checked, verifyError, verifyData],
  );

  useEffect(() => {
    if (sent) {
      form.validateFields(['email']);
    }
    if (checked) {
      form.validateFields(['verifyToken']);
    }
  }, [sent, checked, form, sendError, verifyError]);

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

  return (
    <StyledAuthPage minWidth="350px" maxWidth="500px">
      <StyledTitle>비밀번호 변경</StyledTitle>
      <Form name="reset-password-form" form={form} onFinish={onFinish}>
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
            <Button onClick={onClickSend} loading={sendLoading}>
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
            <Button onClick={onClickVerify} loading={verifyLoading}>
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
        <Button
          type="primary"
          htmlType="submit"
          className="button button-action"
          loading={resetLoading}
        >
          비밀번호 변경
        </Button>
      </Form>
    </StyledAuthPage>
  );
};
export default ResetPasswordPresenter;

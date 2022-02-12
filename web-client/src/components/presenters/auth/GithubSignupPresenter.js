import { useCallback, useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { StyledTitle } from '../styled/StyledTitle';
import { StyledAuthPage } from '../styled/auth/StyledAuthPage';

const GithubSignupPresenter = ({
  loading,
  onGithubSignup,
  duplicated,
  checked,
  onDuplicateCheck,
}) => {
  const [form] = Form.useForm();
  const [validated, setValidated] = useState(false);

  // 회원가입 Form onFinish(onSubmit) 핸들러
  const onFinish = useCallback(
    (values) => onGithubSignup(values.nickname),
    [onGithubSignup],
  );

  // 닉네임
  const nickname = form.getFieldValue('nickname');

  // 닉네임 onChange 리스너
  const onChangeNickname = useCallback(
    (e) => {
      onDuplicateCheck('nickname', e.target.value);
    },
    [onDuplicateCheck],
  );

  useEffect(() => {
    if (checked && duplicated) {
      setValidated(false);
    } else {
      setValidated(true);
    }
  }, [checked, duplicated, nickname]);

  useEffect(() => {
    if (checked) {
      form.validateFields(['nickname']);
    }
  }, [checked, validated, form]);

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

      if (validated) return Promise.resolve();

      if (!validated) {
        return Promise.reject(new Error('사용중인 닉네임입니다.'));
      }

      return Promise.resolve();
    },
    [validated],
  );

  return (
    <StyledAuthPage width="350px">
      <StyledTitle>깃허브 회원가입</StyledTitle>
      <Form name="github-signup-form" form={form} onFinish={onFinish}>
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
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="button button-action"
        >
          회원가입
        </Button>
      </Form>
    </StyledAuthPage>
  );
};

export default GithubSignupPresenter;

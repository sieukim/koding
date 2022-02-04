import styled from 'styled-components';
import { useCallback, useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useMessage } from '../../../hooks/useMessage';

const StyledGithubSignup = styled.div`
  .title-text {
    text-align: center;
    font-weight: bold;
    font-size: 32px;
    margin: 24px 0;
  }

  .github-signup-form {
    max-width: 500px;
    min-width: 350px;
  }

  .github-signup-form-button {
    width: 100%;
  }
`;

const GithubSignupPresenter = ({
  githubSignup,
  githubSignupState,
  duplicated,
  checked,
  duplicateCheck,
}) => {
  const [form] = Form.useForm();
  const [validated, setValidated] = useState(false);

  // 회원가입 Form onFinish(onSubmit) 핸들러
  const onFinish = useCallback(
    (values) => githubSignup(values.nickname),
    [githubSignup],
  );

  // 닉네임 onChange 리스너
  const onChangeNickname = useCallback(
    (e) => {
      duplicateCheck('nickname', e.target.value);
    },
    [duplicateCheck],
  );

  // 닉네임 유효성 검증
  const nickname = form.getFieldValue('nickname');

  useEffect(() => {
    if (checked && duplicated) {
      setValidated((validated) => false);
    } else {
      setValidated((validated) => true);
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

  // message
  useMessage(githubSignupState, 'Hello World! 👻');

  return (
    <StyledGithubSignup>
      <div className="title-text">깃허브 회원가입</div>

      <Form
        name="github-signup-form"
        form={form}
        className="github-signup-form"
        onFinish={onFinish}
      >
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
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="github-signup-form-button"
            loading={githubSignupState.loading}
          >
            회원가입
          </Button>
        </Form.Item>
      </Form>
    </StyledGithubSignup>
  );
};

export default GithubSignupPresenter;

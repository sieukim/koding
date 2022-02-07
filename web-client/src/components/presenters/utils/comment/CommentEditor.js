import { Avatar, Button, Form, Mentions } from 'antd';
import { useCallback } from 'react';
import { getMentionedList } from '../function/getMentionedList';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const StyledCommentEditor = styled.div`
  .editor-form {
    display: flex;
    align-items: center;

    .editor-meta {
      display: flex;
      flex-direction: column;
      align-items: center;

      .ant-avatar {
        margin-bottom: 10px;
      }
    }

    .editor-content {
      width: 100%;
      margin-left: 20px;
    }
  }
`;

export const CommentEditor = ({ user, loading, onClick }) => {
  const [form] = Form.useForm();

  // 댓글 등록 onFinish(onSubmit) 핸들러
  const onFinish = useCallback(() => {
    const content = form.getFieldValue('content');
    const mentionedList = getMentionedList(content);

    onClick({ content: content, mentionedList: mentionedList });

    form.resetFields(['content']);
  }, [form, onClick]);

  return (
    <StyledCommentEditor>
      <Form
        form={form}
        name="editor-form"
        className="editor-form"
        onFinish={onFinish}
      >
        <Form.Item>
          <div className="editor-meta">
            {user.avatarUrl ? (
              <Avatar src={user.avatarUrl} />
            ) : (
              <Avatar icon={<UserOutlined />} />
            )}
            <Button type="primary" htmlType="submit" loading={loading}>
              등록
            </Button>
          </div>
        </Form.Item>
        <Form.Item
          name="content"
          rules={[{ required: true, message: '⚠️ 댓글 내용이 없습니다. ⚠️' }]}
          className="editor-content"
        >
          <Mentions autoSize={{ minRows: 4 }} />
        </Form.Item>
      </Form>
    </StyledCommentEditor>
  );
};

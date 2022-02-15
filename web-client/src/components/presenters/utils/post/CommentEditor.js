import { Button, Form, Mentions } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { StyledCommentEditor } from '../../styled/post/StyledCommentEditor';
import { AvatarLink } from '../link/AvatarLink';

export const CommentEditor = ({ user, loading, post, writers, onClick }) => {
  const [form] = Form.useForm();

  const [mentionedNicknames, setMentionedNicknames] = useState([]);

  // 멘션 onSelect 핸들러
  const onSelect = useCallback((option) => {
    const value = option.value;
    setMentionedNicknames((mentionedNicknames) =>
      mentionedNicknames.includes(value)
        ? mentionedNicknames
        : [...mentionedNicknames, value],
    );
  }, []);

  // 댓글 등록 onFinish(onSubmit) 핸들러
  const onFinish = useCallback(() => {
    const content = form.getFieldValue('content');

    onClick({ content: content, mentionedNicknames: mentionedNicknames });
    form.resetFields(['content']);
    setMentionedNicknames([]);
  }, [form, onClick, mentionedNicknames]);

  // 게시글 변경시 댓글 내용 초기화
  useEffect(() => {
    return () => form.resetFields(['content']);
  }, [form, post]);

  return (
    <StyledCommentEditor>
      <Form
        form={form}
        name="editor-form"
        className="editor-form"
        onFinish={onFinish}
      >
        <div className="editor-meta">
          <AvatarLink nickname={user.nickname} className="writer-avatar" />
          <Button type="primary" htmlType="submit" loading={loading}>
            등록
          </Button>
        </div>
        <Form.Item
          name="content"
          rules={[{ required: true, message: '댓글 내용이 없습니다.️' }]}
          className="editor"
        >
          <Mentions
            autoSize={{ minRows: 4 }}
            onSelect={onSelect}
            placeholder="등록 후에는 수정이 불가하니 신중히 작성해주세요! 타인에게 불쾌감을 주는 언행, 욕설, 상업적 광고 정치 이야기등은 삭제될 수 있습니다. "
          >
            {writers.map((writer) => (
              <Mentions.Option key={writer} value={writer}>
                {writer}
              </Mentions.Option>
            ))}
          </Mentions>
        </Form.Item>
      </Form>
    </StyledCommentEditor>
  );
};

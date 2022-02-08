import styled from 'styled-components';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Editor } from '../utils/editor/Editor';
import { Button, Form, Input } from 'antd';
import { Tags } from '../utils/editor/Tags';

const StyledEditPost = styled.div`
  border: 1px solid rgb(217, 217, 217);
  border-radius: 8px;
  margin: 50px 0;
  padding: 32px 32px 8px 32px;
  width: 900px;

  input {
    border: none;
    border-left: 1px solid rgb(217, 217, 217);
  }

  .form-footer {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
`;

const EditPostPresenter = ({
  loading,
  boardType,
  post,
  onClickEdit,
  tagsList,
}) => {
  const editorRef = useRef();

  const [form] = Form.useForm();

  // 제목
  useEffect(() => {
    form.setFieldsValue({ title: post.title });
  }, [form, post]);

  // 내용
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.getInstance().setMarkdown(post.markdownContent);
    }
  }, [editorRef, post]);

  // 입력 태그 배열
  const [tags, setTags] = useState([]);

  // 이미지 Url
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    setTags(post.tags ?? []);
    setImageUrls(post.imageUrls ?? []);
  }, [post]);

  // 게시글 수정
  const onFinish = useCallback(
    (values) => {
      if (editorRef.current) {
        const markdownContent = editorRef.current.getInstance().getMarkdown();
        const htmlContent = editorRef.current.getInstance().getHTML();

        onClickEdit({
          ...values,
          markdownContent,
          htmlContent,
          tags,
          imageUrls: imageUrls.filter((imageUrl) =>
            markdownContent.includes(imageUrl),
          ),
        });
      }
    },
    [editorRef, onClickEdit, tags, imageUrls],
  );

  return (
    <StyledEditPost>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="title"
          rules={[{ required: true, message: '제목을 입력하세요.' }]}
        >
          <Input placeholder="제목을 입력하세요." />
        </Form.Item>
        <Form.Item
          name="content"
          rules={[{ required: true, message: '내용을 입력하세요.' }]}
        >
          <Editor innerRef={editorRef} setImageUrls={setImageUrls} />
        </Form.Item>
        <div className="form-footer">
          <Form.Item name="tags">
            <Tags
              boardType={boardType}
              tags={tags}
              setTags={setTags}
              tagsList={tagsList}
            />
          </Form.Item>
          <Button htmlType="submit" loading={loading}>
            등록
          </Button>
        </div>
      </Form>
    </StyledEditPost>
  );
};

export default EditPostPresenter;

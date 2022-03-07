import { Editor as ToastEditor } from '@toast-ui/react-editor';
import Prism from 'prismjs';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import uml from '@toast-ui/editor-plugin-uml';
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
import chart from '@toast-ui/editor-plugin-chart';
import '@toast-ui/editor/dist/toastui-editor.css';
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import { useCallback } from 'react';
import * as api from '../../../../modules/api';

export const Editor = (props) => {
  const { innerRef, setImageUrls, ...rest } = props;

  const addImageBlobHook = useCallback(async (blob, callback) => {
    const response = await api.uploadImage(blob);
    const imageUrl = response.data.imageUrl;

    setImageUrls((imageUrls) => [...imageUrls, imageUrl]);
    callback(imageUrl, 'alt_text');
    // eslint-disable-next-line
  }, []);

  return (
    <ToastEditor
      ref={innerRef}
      height="auto"
      minHeight="700px"
      previewStyle="vertical"
      initialEditType="wysiwyg"
      language="ko-KR"
      useCommandShortcut={true}
      plugins={[
        [codeSyntaxHighlight, { highlighter: Prism }],
        colorSyntax,
        uml,
        tableMergedCell,
        chart,
      ]}
      placeholder="내용을 입력하세요."
      hooks={{ addImageBlobHook: addImageBlobHook }}
      {...rest}
    />
  );
};

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

export const Editor = (props) => {
  const { innerRef, ...rest } = props;
  return (
    <ToastEditor
      ref={innerRef}
      initialEditType="markdown"
      previewStyle="vertical"
      useCommandShortcut={true}
      plugins={[
        [codeSyntaxHighlight, { highlighter: Prism }],
        colorSyntax,
        uml,
        tableMergedCell,
        chart,
      ]}
      placeholder="내용을 입력하세요."
      {...rest}
    />
  );
};

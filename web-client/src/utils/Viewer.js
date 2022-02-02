// viewer 컴포넌트
import { Viewer as ToastViewer } from '@toast-ui/react-editor';
import Prism from 'prismjs';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all';
import uml from '@toast-ui/editor-plugin-uml';
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
import chart from '@toast-ui/editor-plugin-chart';
import '@toast-ui/editor/dist/toastui-editor.css';
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

export const Viewer = (props) => {
  const { innerRef, markdownContent, ...rest } = props;
  return (
    <ToastViewer
      ref={innerRef}
      initialValue={markdownContent}
      plugins={[
        [codeSyntaxHighlight, { highlighter: Prism }],
        uml,
        tableMergedCell,
        chart,
      ]}
      {...rest}
    />
  );
};

import { NavLink } from 'react-router-dom';
import { getDate } from './getDate';
// editor
import {
  Editor as ToastEditor,
  Viewer as ToastViewer,
} from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
// codeSyntaxHighlight
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all';
// colorSyntax
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
// uml
import uml from '@toast-ui/editor-plugin-uml';
// table-merged-cell
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
// chart
import chart from '@toast-ui/editor-plugin-chart';

// 마이페이지로 가는 NavLink
export const MyPageLink = (props) => {
  return (
    <NavLink to={`/user/${props.nickname}/profile`} {...props}>
      {props.str ?? props.nickname}
    </NavLink>
  );
};

// 게시글로 가는 NavLink
export const PostLink = (props) => {
  return (
    <NavLink to={`/board/${props.boardType}/post/${props.postId}`} {...props}>
      {props.postTitle}
    </NavLink>
  );
};

// api 호출 로딩중이거나 오류가 발생한 경우 멘트를 출력하는 컴포넌트
export const PrintState = (props) => {
  if (props.loading && props.state.loading) {
    return <div {...props}>로딩중입니다. 잠시만 기다려주세요.</div>;
  } else if (props.state.error) {
    return (
      <div {...props}>오류가 발생했습니다. 잠시 후 다시 시도해주세요.</div>
    );
  } else {
    return null;
  }
};

// 날짜를 보여주는 컴포넌트
export const GetDate = (props) => {
  return <div {...props}>{getDate(props.date)}</div>;
};

// editor 컴포넌트
export const Editor = (props) => {
  return (
    <ToastEditor
      ref={props.innerRef}
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
      {...props}
    />
  );
};

// viewer 컴포넌트
export const Viewer = (props) => {
  return (
    <ToastViewer
      ref={props.innerRef}
      initialValue={props.markdownContent}
      plugins={[
        [codeSyntaxHighlight, { highlighter: Prism }],
        uml,
        tableMergedCell,
        chart,
      ]}
      {...props}
    />
  );
};

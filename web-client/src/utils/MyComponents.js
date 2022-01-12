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
  const { nickname, str, rest } = props;
  return (
    <NavLink to={`/user/${nickname}/profile`} {...rest}>
      {str ?? nickname}
    </NavLink>
  );
};

// 게시글로 가는 NavLink
export const PostLink = (props) => {
  const { boardType, postId, postTitle, ...rest } = props;
  return (
    <NavLink to={`/board/${boardType}/post/${postId}`} {...rest}>
      {postTitle}
    </NavLink>
  );
};

// 팔로우 리스트로 가는 NavLink
export const FollowListLink = (props) => {
  const { nickname, number, type, ...rest } = props;
  return (
    <NavLink to={`/user/${nickname}/profile/${type}`} {...rest}>
      {number}
    </NavLink>
  );
};

// api 호출 로딩중이거나 오류가 발생한 경우 멘트를 출력하는 컴포넌트
export const PrintState = (props) => {
  const { state, loading, ...rest } = props;
  if (loading && state.loading) {
    return <div {...rest}>로딩중입니다. 잠시만 기다려주세요.</div>;
  } else if (state.error) {
    return <div {...rest}>오류가 발생했습니다. 잠시 후 다시 시도해주세요.</div>;
  } else {
    return null;
  }
};

// 날짜를 보여주는 컴포넌트
export const GetDate = (props) => {
  const { date, ...rest } = props;
  return <div {...rest}>{getDate(date)}</div>;
};

// editor 컴포넌트
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

// viewer 컴포넌트
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

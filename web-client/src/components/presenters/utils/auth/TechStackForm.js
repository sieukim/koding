import { Input, message, Tag } from 'antd';
import { getTagColor } from '../function/getTagColor';
import { StyledTechStackForm } from '../../styled/auth/StyledTechStackForm';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useRef, useState } from 'react';

export const TagsForm = ({ type, state, setState, className }) => {
  // 입력창 여부
  const [inputVisible, setInputVisible] = useState(false);

  // 입력 태그 내용
  const [inputTag, setInputTag] = useState('');

  // 입력 태그 ref
  const inputRef = useRef();

  // 입력 태그 onClick 핸들러
  const onClickInput = useCallback(() => {
    setInputVisible(true);
  }, []);

  useEffect(() => {
    if (inputVisible) inputRef.current.focus();
  }, [inputVisible]);

  // 입력 태그 onChange 핸들러
  const onChangeInput = useCallback((e) => {
    setInputTag(e.target.value);
  }, []);

  // 입력창 onBlur 핸들러
  const onBlur = useCallback(() => {
    if (inputTag && state.length === 5) {
      if (type === '보유 기술')
        message.error('보유 기술은 5개까지 추가 가능합니다.');
      if (type === '관심 분야')
        message.error('관심 분야는 5개까지 추가 가능합니다.');
      return;
    }

    if (inputTag.includes(',')) {
      message.error('태그는 ,를 포함할 수 없습니다.');
      return;
    }

    if (inputTag && state.indexOf(inputTag) === -1) {
      setState((state) => [...state, inputTag]);
    }
    setInputVisible(false);
    setInputTag('');
    // eslint-disable-next-line
  }, [state, inputTag, type]);

  // 입력창 엔터 버튼 onPress 핸들러 (-> 입력 태그 추가)
  const onPressEnter = useCallback(() => {
    inputRef.current.blur();
  }, [inputRef]);

  // 태그 onClose 핸들러
  const onCloseTag = useCallback((closedTag) => {
    setState((state) => state.filter((tag) => tag !== closedTag));
    // eslint-disable-next-line
  }, []);

  // 전체 태그 삭제 onClick 핸들러
  const onClickRemoveAll = useCallback(() => {
    setState([]);
    // eslint-disable-next-line
  }, []);

  return (
    <div className={className}>
      {state.map((tag) => (
        <Tag
          key={tag}
          closable
          onClose={() => onCloseTag(tag)}
          color={getTagColor(tag)}
          className="tag"
        >
          {tag}
        </Tag>
      ))}
      <Input
        type="text"
        size="small"
        ref={inputRef}
        value={inputTag}
        onChange={onChangeInput}
        onBlur={onBlur}
        onPressEnter={onPressEnter}
        className={inputVisible ? 'tag-visible' : 'tag-invisible'}
      />
      {!inputVisible && (
        <Tag className="tag tag-action tag-action-add" onClick={onClickInput}>
          <PlusOutlined /> {`${type}`} 추가
        </Tag>
      )}
      <Tag
        className="tag tag-action tag-action-remove"
        onClick={onClickRemoveAll}
      >
        <MinusOutlined /> 전체 삭제
      </Tag>
    </div>
  );
};

export const TechStackForm = ({
  techStack,
  setTechStack,
  interestTech,
  setInterestTech,
}) => {
  return (
    <StyledTechStackForm>
      <TagsForm
        type="보유 기술"
        state={techStack}
        setState={setTechStack}
        className="techStack-container"
      />
      <TagsForm
        type="관심 분야"
        state={interestTech}
        setState={setInterestTech}
        className="interestTech-container"
      />
    </StyledTechStackForm>
  );
};

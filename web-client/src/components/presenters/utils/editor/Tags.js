import { useCallback, useEffect, useRef, useState } from 'react';
import { AutoComplete, Input, message, Tag } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { getTagColor } from '../function/getTagColor';
import { StyledTags } from '../../styled/post/StyledTags';

export const Tags = ({ boardType, tags, setTags, tagsList }) => {
  // 입력창 여부
  const [inputVisible, setInputVisible] = useState(false);

  // 입력 태그 내용
  const [inputTag, setInputTag] = useState('');

  // 입력 태그 ref
  const inputRef = useRef();

  // 입력 태그 onClick 핸들러
  const onClickInput = useCallback(() => {
    setInputVisible(true);
    // eslint-disable-next-line
  }, [inputRef]);

  useEffect(() => {
    if (inputVisible) inputRef.current.focus();
  }, [inputVisible]);

  // 입력 태그 onChange 핸들러
  const onChangeInput = useCallback((e) => {
    setInputTag(e.target.value);
  }, []);

  // 입력창 onBlur 핸들러
  const onBlur = useCallback(() => {
    if (inputTag && tags.length === 5) {
      message.error('태그 삽입은 5개까지 허용됩니다.');
      return;
    }

    if (inputTag.includes(',')) {
      message.error('태그는 ,를 포함할 수 없습니다.');
      return;
    }

    if (inputTag && tags.indexOf(inputTag) === -1) {
      setTags((tags) => [...tags, inputTag]);
    }
    setInputVisible(false);
    setInputTag('');
    // eslint-disable-next-line
  }, [inputTag, tags, boardType]);

  // 입력창 엔터 버튼 onPress 핸들러 (-> 입력 태그 추가)
  const onPressEnter = useCallback(() => {
    inputRef.current.blur();
  }, [inputRef]);

  // 태그 onClose 핸들러
  const onCloseTag = useCallback(
    (closedTag) => {
      setTags((tags) => tags.filter((tag) => tag !== closedTag));
    },
    // eslint-disable-next-line
    [boardType],
  );

  // 전체 태그 삭제 onClick 핸들러
  // eslint-disable-next-line
  const onClickRemoveAll = useCallback(() => setTags([]), [boardType]);

  // autoComplete filterOption
  const filterOption = useCallback(
    (inputValue, option) =>
      option.value.toLowerCase().includes(inputTag.toLowerCase()),
    [inputTag],
  );

  // autoComplete onSelect 핸들러
  const onSelectTag = useCallback(
    (value) => {
      if (value && tags.indexOf(value) === -1) {
        setTags((tags) => [...tags, value]);
      }
      setInputVisible(false);
      setInputTag('');
    },
    // eslint-disable-next-line
    [tags, boardType],
  );

  return (
    <StyledTags>
      {tags.map((tag) => (
        <Tag
          key={tag}
          closable
          onClose={() => onCloseTag(tag)}
          color={getTagColor(tag)}
        >
          {tag}
        </Tag>
      ))}
      <AutoComplete
        options={tagsList}
        filterOption={filterOption}
        value={inputTag}
        onSelect={onSelectTag}
        className={inputVisible ? `input-tag-visible` : `input-tag-invisible`}
      >
        <Input
          type="text"
          size="small"
          ref={inputRef}
          value={inputTag}
          onChange={onChangeInput}
          onBlur={onBlur}
          onPressEnter={onPressEnter}
        />
      </AutoComplete>
      {!inputVisible && (
        <Tag className="custom-tag" onClick={onClickInput}>
          <PlusOutlined /> 태그 삽입
        </Tag>
      )}
      <Tag className="custom-tag" onClick={onClickRemoveAll}>
        <MinusOutlined /> 전체 삭제
      </Tag>
    </StyledTags>
  );
};

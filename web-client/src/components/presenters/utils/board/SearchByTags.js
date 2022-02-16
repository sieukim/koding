import { useCallback, useEffect, useRef, useState } from 'react';
import { AutoComplete, Input, message, Tag } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getTagColor } from '../function/getTagColor';
import { StyledSearchByTag } from '../../styled/board/StyledSearchByTag';

export const SearchByTags = ({ boardType, tagsParams, tagsList, queries }) => {
  const navigate = useNavigate();

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
    if (inputTag && tagsParams.length === 10) {
      message.error('태그 검색은 10개까지 허용됩니다.');
      return;
    }

    if (inputTag && tagsParams.indexOf(inputTag) === -1) {
      const newTags = [...tagsParams, inputTag];
      queries.set('tags', newTags);
      navigate(`/board/${boardType}?${queries.toString()}`);
    }
    setInputVisible(false);
    setInputTag('');
  }, [navigate, boardType, queries, tagsParams, inputTag]);

  // 입력창 엔터 버튼 onPress 핸들러 (-> 입력 태그 추가)
  const onPressEnter = useCallback(() => {
    inputRef.current.blur();
  }, [inputRef]);

  // 태그 onClose 핸들러
  const onCloseTag = useCallback(
    (closedTag) => {
      const newTags = tagsParams.filter((tag) => tag !== closedTag);
      if (newTags.length === 0) queries.delete('tags');
      else queries.set('tags', newTags);
      navigate(`/board/${boardType}?${queries.toString()}`);
    },
    [navigate, boardType, queries, tagsParams],
  );

  // 전체 태그 삭제 onClick 핸들러
  const onClickRemoveAll = useCallback(() => {
    queries.delete('tags');
    navigate(`/board/${boardType}?${queries.toString()}`);
  }, [navigate, boardType, queries]);

  // autoComplete filterOption
  const filterOption = useCallback(
    (inputValue, option) =>
      option.value.toLowerCase().includes(inputTag.toLowerCase()),
    [inputTag],
  );

  // autoComplete onSelect 핸들러
  const onSelectTag = useCallback(
    (selectedTag) => {
      if (selectedTag && tagsParams.indexOf(selectedTag) === -1) {
        const newTags = [...tagsParams, selectedTag];
        queries.set('tags', newTags);
        navigate(`/board/${boardType}?${queries.toString()}`);
      }
      setInputVisible(false);
      setInputTag('');
    },
    [navigate, boardType, queries, tagsParams],
  );

  return (
    <StyledSearchByTag>
      {tagsParams.map((tag) => (
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
      <AutoComplete
        options={tagsList}
        filterOption={filterOption}
        value={inputTag}
        onSelect={onSelectTag}
        className={inputVisible ? `tag-visible` : `tag-invisible`}
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
        <Tag className="tag tag-action" onClick={onClickInput}>
          <PlusOutlined /> 태그 검색
        </Tag>
      )}
      <Tag className="tag tag-action" onClick={onClickRemoveAll}>
        <MinusOutlined /> 전체 삭제
      </Tag>
    </StyledSearchByTag>
  );
};

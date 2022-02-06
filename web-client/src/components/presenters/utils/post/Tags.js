import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { Tag } from 'antd';
import { getTagColor } from '../function/getTagColor';

const StyledTags = styled.div`
  .ant-tag:hover {
    cursor: pointer;
  }
`;

export const Tags = ({ post, tags }) => {
  const navigate = useNavigate();

  // 태그 onClick 핸들러
  const onClickTag = useCallback(
    (e) => {
      const [boardType, tag] = e.target.dataset.metadata.split(',');
      navigate(`/board/${boardType}?tags=${tag}`);
    },
    [navigate],
  );

  return (
    <StyledTags>
      {tags.map((tag) => (
        <Tag
          key={tag}
          color={getTagColor(tag)}
          onClick={onClickTag}
          data-metadata={[post.boardType, tag]}
        >
          {tag}
        </Tag>
      ))}
    </StyledTags>
  );
};

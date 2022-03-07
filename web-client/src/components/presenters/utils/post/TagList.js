import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { Tag } from 'antd';
import { getTagColor } from '../function/getTagColor';

export const TagList = ({ post, tags }) => {
  // navigate
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
    <div className="tag-container">
      {tags?.map((tag) => (
        <Tag
          key={tag}
          color={getTagColor(tag)}
          onClick={onClickTag}
          data-metadata={[post.boardType, tag]}
          className="tag"
        >
          {tag}
        </Tag>
      ))}
    </div>
  );
};

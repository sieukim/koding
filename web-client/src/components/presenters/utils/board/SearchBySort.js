import { Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBySort = ({ boardType, queries, sortParams }) => {
  // navigate
  const navigate = useNavigate();

  const [selected, setSelected] = useState({
    latest: true,
    likeCount: false,
    commentCount: false,
    scrapCount: false,
    readCount: false,
  });

  useEffect(() => {
    if (sortParams) {
      setSelected({
        latest: false,
        likeCount: false,
        commentCount: false,
        scrapCount: false,
        readCount: false,
        [sortParams]: true,
      });
    } else {
      setSelected({
        latest: true,
        likeCount: false,
        commentCount: false,
        scrapCount: false,
        readCount: false,
      });
    }
  }, [sortParams]);

  // 버튼 onClick 핸들러
  const onClick = useCallback(
    (sortType) => {
      if (sortType !== 'latest') queries.set('sort', sortType);
      else queries.delete('sort');
      navigate(`/board/${boardType}?${queries.toString()}`);
    },
    [navigate, boardType, queries],
  );

  return (
    <div className="board-sort">
      <Button
        type="text"
        icon={<CheckOutlined />}
        onClick={() => onClick('latest')}
        className={`button button-sort ${selected.latest && 'button-selected'}`}
      >
        최신순
      </Button>
      <Button
        type="text"
        icon={<CheckOutlined />}
        onClick={() => onClick('likeCount')}
        className={`button button-sort ${
          selected.likeCount && 'button-selected'
        }`}
      >
        좋아요순
      </Button>
      <Button
        type="text"
        icon={<CheckOutlined />}
        onClick={() => onClick('commentCount')}
        className={`button button-sort ${
          selected.commentCount && 'button-selected'
        }`}
      >
        댓글순
      </Button>
      <Button
        type="text"
        icon={<CheckOutlined />}
        onClick={() => onClick('scrapCount')}
        className={`button button-sort ${
          selected.scrapCount && 'button-selected'
        }`}
      >
        스크랩순
      </Button>
      <Button
        type="text"
        icon={<CheckOutlined />}
        onClick={() => onClick('readCount')}
        className={`button button-sort ${
          selected.readCount && 'button-selected'
        }`}
      >
        조회순
      </Button>
    </div>
  );
};

export default SearchBySort;

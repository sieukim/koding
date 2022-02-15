import { Button } from 'antd';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { StyledNav } from '../styled/post/StyledNav';

export const NavPresenter = ({
  prev,
  next,
  onClickPrev,
  onClickNext,
  onClickBoard,
}) => {
  return (
    <StyledNav>
      <Button
        type="text"
        onClick={prev && onClickPrev}
        className="button prev-button"
      >
        <LeftCircleOutlined
          style={{
            color: 'grey',
            fontSize: 'large',
            fontWeight: 'lighter',
          }}
        />
        <div className="button-content">
          <div className="button-title">이전 글</div>
          <div className="post-title">
            {prev?.title ?? '이전 글이 없습니다. '}
          </div>
        </div>
      </Button>
      <Button
        type="text"
        onClick={onClickBoard}
        className="button board-button"
      >
        목록
      </Button>
      <Button
        type="text"
        onClick={next && onClickNext}
        className="button next-button"
      >
        <div className="button-content">
          <div className="button-title">다음 글</div>
          <div className="post-title">
            {next?.title ?? '다음 글이 없습니다.'}
          </div>
        </div>
        <RightCircleOutlined
          style={{
            color: 'grey',
            fontSize: 'large',
            fontWeight: 'lighter',
          }}
        />
      </Button>
    </StyledNav>
  );
};

export default NavPresenter;

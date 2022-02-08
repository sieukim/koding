import styled from 'styled-components';
import { Button } from 'antd';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import React from 'react';

const StyledNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  border: 1px solid rgb(217, 217, 217);
  border-radius: 8px;
  margin: 20px 0;
  width: 900px;
  height: 100px;

  .prev-button,
  .next-button,
  .board-button {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 32px;
  }

  .prev-button,
  .next-button {
    width: 40%;
  }

  .prev-button {
    justify-content: left;

    .title-container {
      margin-left: 20px;
      text-align: left;

      .button-title {
        margin-bottom: 10px;
        font-size: 1rem;
      }

      .post-title {
        font-weight: 100;
      }
    }
  }

  .next-button {
    justify-content: right;

    .title-container {
      margin-right: 20px;
      text-align: right;

      .button-title {
        margin-bottom: 10px;
        font-size: 1rem;
      }

      .post-title {
        font-weight: 100;
      }
    }
  }

  .board-button {
    width: 20%;
    justify-content: center;
  }
`;

export const NavButton = ({
  prev,
  next,
  onClickPrev,
  onClickNext,
  onClickBoard,
}) => {
  return (
    <StyledNav>
      <Button type="text" onClick={prev && onClickPrev} className="prev-button">
        <LeftCircleOutlined
          style={{
            color: 'grey',
            fontSize: 'large',
            fontWeight: 'lighter',
          }}
        />
        <div className="title-container">
          <div className="button-title">이전 글</div>
          <div className="post-title">
            {prev?.title ?? '이전 글이 없습니다. '}
          </div>
        </div>
      </Button>
      <Button type="text" onClick={onClickBoard} className="board-button">
        목록
      </Button>
      <Button type="text" onClick={next && onClickNext} className="next-button">
        <div className="title-container">
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

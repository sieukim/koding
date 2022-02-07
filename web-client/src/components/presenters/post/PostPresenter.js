import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Viewer } from '../utils/editor/Viewer';
import { Button, List, Spin } from 'antd';
import { Tags } from '../utils/post/Tags';
import { metadata } from '../utils/post/metadata';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';

const StyledPost = styled.div`
  border: 1px solid rgb(217, 217, 217);
  border-radius: 8px;
  margin-top: 50px;
  padding: 32px;
  width: 900px;

  .spinner {
    width: 100%;
    text-align: center;
  }

  .ant-list-item-meta-title {
    font-size: 2em;
  }

  a:hover {
    color: #1890ff !important;

    * {
      color: #1890ff !important;
    }
  }

  .toastui-editor-contents {
    margin: 27px 0;
  }

  .item-black {
    * {
      color: black;
    }
  }

  .item-red {
    * {
      color: #cf1322;
    }
  }

  .item-blue {
    * {
      color: #096dd9;
    }
  }

  .item-yellow {
    * {
      color: #faad14;
    }
  }
`;

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

const NavButton = ({ prev, next, onClickPrev, onClickNext, onClickBoard }) => {
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

const PostPresenter = ({
  user,
  loading,
  post,
  prev,
  next,
  onClickLike,
  onClickUnlike,
  onClickScrap,
  onClickUnscrap,
  onClickEdit,
  onClickRemove,
  onClickPrev,
  onClickNext,
  onClickBoard,
}) => {
  // 게시글 내용 viewer
  const viewerRef = useRef();

  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.getInstance().setMarkdown(post.markdownContent);
    }
  }, [viewerRef, post.markdownContent]);

  return (
    <>
      <StyledPost>
        {loading ? (
          <div className="spinner">
            <Spin />
          </div>
        ) : (
          <List
            dataSource={[post]}
            renderItem={(post) => (
              <List.Item
                key={post.postId}
                actions={metadata(
                  user,
                  post,
                  onClickLike,
                  onClickUnlike,
                  onClickScrap,
                  onClickUnscrap,
                  onClickEdit,
                  onClickRemove,
                )}
              >
                <List.Item.Meta title={post.title} />
                <Viewer innerRef={viewerRef} />
                <Tags post={post} tags={post.tags ?? []} />
              </List.Item>
            )}
            itemLayout="vertical"
          />
        )}
      </StyledPost>
      <NavButton
        prev={prev}
        next={next}
        onClickPrev={onClickPrev}
        onClickNext={onClickNext}
        onClickBoard={onClickBoard}
      />
    </>
  );
};

export default PostPresenter;

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Viewer } from '../utils/editor/Viewer';
import { List, Spin } from 'antd';
import { Tags } from '../utils/post/Tags';
import { metadata } from '../utils/post/metadata';
import { NavButton } from '../utils/post/NavButton';

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

  .item-nickname {
    a {
      color: black !important;
    }

    a:hover {
      color: #1890ff !important;
    }
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

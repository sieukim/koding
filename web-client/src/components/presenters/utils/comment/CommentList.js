import styled from 'styled-components';
import { Avatar, Comment, List, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getCreatedAt } from '../function/getCreatedAt';
import { UserOutlined } from '@ant-design/icons';
import { NicknameLink } from '../link/NicknameLink';
import { metadata } from '../comment/metadata';

const StyledCommentList = styled.div`
  a:hover {
    color: #1890ff;
  }

  .ant-comment-actions {
    button {
      padding-left: 0;
    }

    .item-red {
      * {
        color: #cf1322;
      }
    }

    * {
      font-size: 12px;
    }
  }
`;

export const CommentList = ({
  user,
  loading,
  comments,
  next,
  hasMore,
  onClickLike,
  onClickUnlike,
  onClickRemove,
}) => {
  return (
    <StyledCommentList>
      {loading ? (
        <div className="spinner">
          <Spin />
        </div>
      ) : (
        <InfiniteScroll
          next={next}
          hasMore={hasMore}
          dataLength={comments.length}
        >
          <List
            header="댓글"
            dataSource={comments}
            renderItem={(comment) => (
              <li>
                <Comment
                  author={<NicknameLink nickname={comment.writerNickname} />}
                  avatar={
                    comment.avatarUrl ? (
                      <Avatar src={comment.avatarUrl} />
                    ) : (
                      <Avatar icon={<UserOutlined />} />
                    )
                  }
                  content={comment.content ?? ''}
                  datetime={getCreatedAt(comment.createdAt ?? '')}
                  actions={metadata(
                    user,
                    comment,
                    onClickLike,
                    onClickUnlike,
                    onClickRemove,
                  )}
                />
              </li>
            )}
            itemLayout="horizontal"
          />
        </InfiniteScroll>
      )}
    </StyledCommentList>
  );
};

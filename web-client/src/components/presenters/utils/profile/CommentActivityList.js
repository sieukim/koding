import { Collapse, Comment, List, Typography } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  FieldTimeOutlined,
  LikeOutlined,
  LikeTwoTone,
} from '@ant-design/icons';
import { getCreatedAt } from '../function/getCreatedAt';
import React from 'react';
import { IconText } from '../post/IconText';
import { PostLink } from '../link/PostLink';

const CommentList = ({ comments, next, hasMore }) => {
  return (
    <InfiniteScroll
      next={next}
      hasMore={hasMore}
      loader={null}
      dataLength={comments.length}
    >
      <List
        dataSource={comments}
        renderItem={(comment) => (
          <List.Item className="comment-activity">
            <List.Item.Meta
              description={
                <div className="comment-activity-title">
                  <PostLink
                    boardType={comment.boardType}
                    postId={comment.postId}
                    postTitle={comment.post?.title}
                  />
                  <div>에 댓글을 남겼습니다.</div>
                </div>
              }
              className="comment-activity-title"
            />
            <Comment
              key={comment.commentId}
              actions={[
                <IconText
                  key="likeCount"
                  icon={
                    comment.liked ? (
                      <LikeTwoTone twoToneColor="#cf1322" />
                    ) : (
                      <LikeOutlined />
                    )
                  }
                  text={comment.likeCount ?? 0}
                  className="item-red"
                />,
                <IconText
                  key="createdAt"
                  icon={<FieldTimeOutlined />}
                  text={getCreatedAt(comment.createdAt ?? '')}
                  className="item-black"
                />,
              ]}
              content={
                <Typography.Paragraph ellipsis={{ rows: 3 }}>
                  {comment.content ?? ''}
                </Typography.Paragraph>
              }
            />
          </List.Item>
        )}
        itemLayout="vertical"
      />
    </InfiniteScroll>
  );
};

export const CommentActivityList = ({ comments, next, hasMore }) => {
  return (
    <div className="comment-activity-container">
      <Collapse accordion className="collapse" ghost>
        <Collapse.Panel header="커뮤니티" key="common">
          <CommentList
            comments={comments.common}
            next={next.common}
            hasMore={hasMore.common}
          />
        </Collapse.Panel>
        <Collapse.Panel header="Q&A" key="question">
          <CommentList
            comments={comments.question}
            next={next.question}
            hasMore={hasMore.question}
          />
        </Collapse.Panel>
        <Collapse.Panel header="스터디 모집" key="study-group">
          <CommentList
            comments={comments[`study-group`]}
            next={next[`study-group`]}
            hasMore={hasMore[`study-group`]}
          />
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

import { StyledTitle } from '../../styled/StyledTitle';
import { StyledBoardMent } from '../../styled/board/StyledBoardMent';

const CommunityMent = () => {
  return (
    <StyledBoardMent>
      <StyledTitle>커뮤니티</StyledTitle>
      <p>
        취준, 자소서, 코테 등의 다양한 이야기를 나누는 공간입니다.
        <br />
        🚫 타인에게 불쾌감을 주는 언행은 모두 신고해주세요! (비방, 욕설, 상업적
        광고, 정치 등) 🚫
      </p>
    </StyledBoardMent>
  );
};

const QnaMent = () => {
  return (
    <StyledBoardMent>
      <StyledTitle>Q&A</StyledTitle>
      <p>
        프로그래밍 관련 질문을 주고 받는 공간입니다.
        <br />
        🚫 타인에게 불쾌감을 주는 언행은 모두 신고해주세요! (비방, 욕설, 상업적
        광고, 정치 등) 🚫
      </p>
    </StyledBoardMent>
  );
};

const RecruitMent = () => {
  return (
    <StyledBoardMent>
      <StyledTitle>채용 정보</StyledTitle>
      <p>
        다양한 회사의 프로그래밍 관련 채용 공고를 확인하는 공간입니다.
        <br />
        🌸 모든 분들의 꽃길을 기원합니다. 🌸
      </p>
    </StyledBoardMent>
  );
};

const StudyGroupMent = () => {
  return (
    <StyledBoardMent>
      <StyledTitle>스터디 모집</StyledTitle>
      <p>
        다양한 주제를 갖고 함께 공부할 그룹 스터디를 모집하는 공간힙니다.
        <br />✨ 좋은 공부, 좋은 인연을 만들길 기원합니다. ✨
      </p>
    </StyledBoardMent>
  );
};

const BlogMent = () => {
  return (
    <StyledBoardMent>
      <StyledTitle>블로그</StyledTitle>
      <p>
        관심있는 주제의 글을 작성하는 공간입니다.
        <br />
        📝 공부한 내용을 정리하여 기록해보아요! 📝
      </p>
    </StyledBoardMent>
  );
};

export const BoardMent = ({ boardType }) => {
  switch (boardType) {
    case 'community':
      return <CommunityMent />;
    case 'qna':
      return <QnaMent />;
    case 'recruit':
      return <RecruitMent />;
    case 'study-group':
      return <StudyGroupMent />;
    case 'blog':
      return <BlogMent />;
    default:
      return <StyledBoardMent>존재하지 않는 게시판입니다.</StyledBoardMent>;
  }
};

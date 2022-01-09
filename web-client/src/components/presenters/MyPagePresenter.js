import styled from 'styled-components';

const StyledMyPage = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  * {
    border: solid 1px;
  }

  .user-info-container {
    display: flex;
    flex-direction: row;

    .user-info {
      .user-info-follow {
        display: flex;
        flex-direction: row;
      }
    }
  }

  .post-container {
  }
`;

const MyPagePresenter = ({ userNickname }) => {
  return (
    <StyledMyPage>
      <div className="user-info-container">
        <div className="user-info">
          <div className="user-info-photo">photo</div>
          <div className="user-info-stack-badge">stack badge</div>
        </div>
        <div className="user-info">
          <div className="user-info-follow">
            <div className="user-info-following">_ 팔로잉</div>
            <div className="user-info-follower">_ 팔로워</div>
          </div>
          <div className="user-info-text">
            <div>닉네임 ${userNickname}</div>
            <div>이메일</div>
            <div>블로그</div>
            <div>깃허브</div>
            <div>포트폴리오</div>
          </div>
        </div>
      </div>
      <div className="post-container">
        <div className="post-navi-bar">navi bar</div>
        <div className="post-content">content</div>
      </div>
    </StyledMyPage>
  );
};

export default MyPagePresenter;

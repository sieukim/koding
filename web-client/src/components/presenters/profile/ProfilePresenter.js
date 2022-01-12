import styled from 'styled-components';
import { useCallback } from 'react';
import { FollowListLink, PrintState } from '../../../utils/MyComponents';

const StyledProfile = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .profile-container {
    display: flex;
    flex-direction: row;
  }

  .profile-photo-badge {
    display: flex;
    justify-content: end;
    width: 50%;
  }

  .profile-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 50%;
  }

  .profile-info-row {
    display: flex;
    flex-direction: row;
    margin: 5px;
    padding: 5px;

    & > div,
    a {
      margin: auto 5px;
      padding: 5px;
    }
  }

  .profile-nickname {
    font-weight: bold;
  }

  .profile-button {
    box-sizing: border-box;
    height: 100%;
  }

  .profile-info-item {
    display: flex;
    flex-direction: row;
    width: 90px;

    & > div {
      margin-right: 5px;
    }
  }

  .profile-info-item-number {
    width: 30px;
    text-align: right;
  }
`;

const ProfilePresenter = ({
  loginUser,
  profileUserNickname,
  followState,
  follow,
  unfollowState,
  unfollow,
  followers,
  followings,
}) => {
  /* 팔로우 */
  // 팔로우
  const onClickFollow = useCallback(
    (e) => {
      e.preventDefault();
      follow(loginUser.nickname, profileUserNickname);
    },
    [follow, loginUser, profileUserNickname],
  );

  // 언팔로우
  const onClickUnfollow = useCallback(
    (e) => {
      e.preventDefault();
      unfollow(loginUser.nickname, profileUserNickname);
    },
    [unfollow, loginUser, profileUserNickname],
  );

  return (
    <StyledProfile>
      <div className="profile-container">
        <div className="profile-photo-badge">사진</div>
        <div className="profile-info">
          <div className="profile-info-row">
            <div className="profile-nickname">{profileUserNickname}</div>
            <div className="profile-button">
              {loginUser && loginUser.nickname === profileUserNickname && (
                <button>프로필 편집</button>
              )}
              {loginUser && loginUser.nickname !== profileUserNickname && (
                <button onClick={onClickFollow}>팔로우</button>
              )}
              <PrintState state={followState} />
              <PrintState state={unfollowState} />
            </div>
          </div>
          <div className="profile-info-row">
            <div className="profile-info-item">
              <div>팔로워</div>
              <FollowListLink
                className="profile-info-item-number"
                nickname={profileUserNickname}
                number={followers}
                type="follower"
              />
            </div>
            <div className="profile-info-item">
              <div>팔로잉</div>
              <FollowListLink
                className="profile-info-item-number"
                nickname={profileUserNickname}
                number={followings}
                type="following"
              />
            </div>
          </div>
          <div className="profile-info-row">
            <div>이메일</div>
            <div>s2lver@naver.com</div>
          </div>
          <div className="profile-info-row">
            <div>깃허브</div>
            <a href="https://github.com/sieukim">https://github.com/sieukim</a>
          </div>
          <div className="profile-info-row">
            <div>포트폴리오</div>
            <a>포트폴리오 주소</a>
          </div>
        </div>
      </div>
    </StyledProfile>
  );
};

export default ProfilePresenter;

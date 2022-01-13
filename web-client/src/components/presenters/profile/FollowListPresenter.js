import styled from 'styled-components';
import { MyPageLink } from '../../../utils/MyComponents';

const StyledFollowList = styled.div`
  display: flex;
  width: 100%;

  .list-container {
    width: 100%;
    background: aliceblue;
    padding: 10px;

    div {
      margin: 5px 0;
      padding: 5px 0;
    }
  }

  .list-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const FollowListPresenter = ({ getFollowerState, getFollowingState, type }) => {
  return (
    <StyledFollowList>
      {type === 'follower' && (
        <div className="list-container">
          <div>팔로워</div>
          {getFollowerState?.success?.data?.followers?.map((follower) => {
            return (
              <div className="list-item" key={follower.nickname}>
                <div>{follower.nickname}</div>
                <button>
                  <MyPageLink str="프로필 방문" nickname={follower.nickname} />
                </button>
              </div>
            );
          })}
        </div>
      )}
      {type === 'following' && (
        <div className="list-container">
          <div>팔로잉</div>
          {getFollowingState?.success?.data?.followings?.map((following) => {
            return (
              <div className="list-item" key={following.nickname}>
                <div>{following.nickname}</div>
                <button>
                  <MyPageLink str="프로필 방문" nickname={following.nickname} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </StyledFollowList>
  );
};

export default FollowListPresenter;

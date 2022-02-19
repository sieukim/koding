import { StyledProfilePage } from '../styled/profile/StyledProfilePage';
import { AvatarItem } from '../utils/profile/AvatarItem';
import { FollowItem } from '../utils/profile/FollowItem';
import { ButtonItem } from '../utils/profile/ButtonItem';
import { UrlItem } from '../utils/profile/UrlItem';
import { SkillItem } from '../utils/profile/SkillItem';
import { UserInfoItem } from '../utils/profile/UserInfoItem';

const ProfilePresenter = ({
  loginUser,
  profileUser,
  onClickFollow,
  onClickUnfollow,
  isFollowingState,
  followersCount,
  followingsCount,
}) => {
  return (
    <StyledProfilePage>
      <div className="item-container item-container-default">
        <AvatarItem
          nickname={profileUser.nickname}
          className="item avatar-item"
        />
        <FollowItem
          nickname={profileUser.nickname}
          followersCount={followersCount}
          followingsCount={followingsCount}
          className="item follow-item"
        />
        <UserInfoItem
          profileUser={profileUser}
          className="item user-info-item"
        />
        <ButtonItem
          profileUser={profileUser}
          loginUser={loginUser}
          isFollowingState={isFollowingState}
          onClickFollow={onClickFollow}
          onClickUnfollow={onClickUnfollow}
          className="item button-item"
        />
      </div>
      <div className="item-container item-container-editable">
        <UrlItem profileUser={profileUser} className="item url-item" />
        <SkillItem profileUser={profileUser} className="item skill-item" />
      </div>
    </StyledProfilePage>
  );
};

export default ProfilePresenter;

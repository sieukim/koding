import MyPagePresenter from '../presenters/MyPagePresenter';

const MyPageContainer = ({ userNickname }) => {
  return <MyPagePresenter userNickname={userNickname} />;
};

export default MyPageContainer;

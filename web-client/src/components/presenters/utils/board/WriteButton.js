import { Button } from 'antd';

export const WriteButton = ({ user, boardType, onClickWrite }) => {
  if (user && (boardType !== 'recruit' || user?.roles.includes('Admin'))) {
    return (
      <Button
        type="primary"
        onClick={onClickWrite}
        className="button button-write"
      >
        게시글 작성
      </Button>
    );
  }

  return null;
};

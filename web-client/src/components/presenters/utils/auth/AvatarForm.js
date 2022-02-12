import { Avatar, Button, message, Upload } from 'antd';
import { useCallback, useState } from 'react';
import { StyledAvatarForm } from '../../styled/auth/StyledAvatarForm';

export const AvatarForm = ({
  defaultAvatarUrl,
  setAvatarFile,
  onClickRemoveAvatar,
}) => {
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatarUrl);

  // 아바타 beforeUpload 핸들러
  const beforeUpload = useCallback((file) => {
    const isValidType = file.type === 'image/jpeg' || file.type === 'image/png';
    const isValidSize = file.size / 1024 / 1024 < 10;

    if (!isValidType) {
      message.error('JPG 또는 PNG 파일을 사용해주세요.');
    }
    if (!isValidSize) {
      message.error('10MB 미만 파일을 사용해주세요.');
    }

    if (isValidType && isValidSize) {
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }

    return false;
    // eslint-disable-next-line
  }, []);

  // 프로필 사진 삭제 onClick 핸들러
  const onClickRemove = useCallback(() => {
    setAvatarFile(null);
    setAvatarUrl(null);

    if (defaultAvatarUrl) {
      onClickRemoveAvatar();
    }
    // eslint-disable-next-line
  }, [defaultAvatarUrl, onClickRemoveAvatar]);

  return (
    <StyledAvatarForm>
      {avatarUrl ? (
        <Avatar src={avatarUrl} />
      ) : (
        <div className="upload-container">
          <div className="upload-text">프로필 사진 (선택)</div>
          <div className="upload-hint">
            10MB 이하 이미지 파일을 <br />
            사용하세요!
          </div>
        </div>
      )}
      <div className="button-container">
        <Upload
          name="avatar"
          accept="image/*"
          listType="picture"
          showUploadList={false}
          multiple={false}
          beforeUpload={beforeUpload}
        >
          <Button htmlType="button" className="button button-action">
            등록
          </Button>
        </Upload>
        <Button
          htmlType="button"
          onClick={onClickRemove}
          className="button-button-action"
        >
          삭제
        </Button>
      </div>
    </StyledAvatarForm>
  );
};

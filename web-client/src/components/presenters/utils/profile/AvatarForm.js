import { Avatar, Button, message, Upload } from 'antd';
import { useCallback, useState } from 'react';
import styled from 'styled-components';

const StyledAvatarForm = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 200px;
  margin-bottom: 24px;

  border: 1px solid #d9d9d9;
  border-radius: 10px;

  :hover {
    pointer: cursor;
  }

  .upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    width: 150px;
    height: 150px;
    padding: 10px;

    border: 1px solid #d9d9d9;
    border-radius: 100px;

    * {
      margin-bottom: 5px;
    }

    .upload-text {
      margin-top: 5px;
      color: #000000d9;
      font-size: 15px;
    }

    .upload-hint {
      color: #00000073;
      font-size: 11px;
    }
  }

  .ant-avatar {
    width: 150px;
    height: 150px;
  }

  .edit-buttons {
    display: flex;
    flex-direction: column;

    width: 100px;
    margin-left: 30px;

    * {
      width: 100%;
    }

    .ant-btn {
      margin: 10px 0;
    }
  }
`;

export const AvatarForm = ({ defaultAvatarUrl, setAvatarFile }) => {
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
  }, []);

  // 프로필 사진 삭제 onClick 핸들러
  const onClickRemove = useCallback(() => {
    setAvatarFile(null);
    setAvatarUrl(null);

    if (defaultAvatarUrl) {
      // 삭제 api 호출 예정
    }
  }, [defaultAvatarUrl]);

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
      <div className="edit-buttons">
        <Upload
          name="avatar"
          accept="image/*"
          listType="picture"
          showUploadList={false}
          multiple={false}
          beforeUpload={beforeUpload}
        >
          <Button htmlType="button">등록</Button>
        </Upload>
        <Button htmlType="button" onClick={onClickRemove}>
          삭제
        </Button>
      </div>
    </StyledAvatarForm>
  );
};

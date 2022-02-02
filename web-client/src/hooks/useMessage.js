import { useEffect } from 'react';
import { message } from 'antd';

export const useMessage = (
  state,
  successMessage,
  failureMessage = '오류가 발생했어요 😭 잠시 후 다시 시도해주세요!',
) => {
  useEffect(() => {
    if (state.success) {
      message.success(successMessage);
    }
    if (state.error) {
      message.error(failureMessage);
    }
  }, [state]);
};

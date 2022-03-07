import { useEffect } from 'react';
import { message } from 'antd';

export const useMessage = (
  state,
  successMessage,
  failureMessage = '오류가 발생했어요 😭 잠시 후 다시 시도해주세요!',
) => {
  useEffect(() => {
    if (state.success) {
      if (successMessage instanceof Function) {
        message.success(successMessage(state));
      } else {
        message.success(successMessage);
      }
    }
    if (state.error) {
      message.error(failureMessage);
    }
    // eslint-disable-next-line
  }, [state]);
};

import { Button, Tooltip } from 'antd';

export const TooltipButton = ({
  tooltipTitle,
  buttonIcon,
  onClickButton,
  className,
  notificationId = null,
}) => {
  return (
    <Tooltip placement="bottom" title={tooltipTitle}>
      <Button
        type="text"
        icon={buttonIcon}
        onClick={onClickButton}
        className={className}
        data-notificationid={notificationId}
      />
    </Tooltip>
  );
};

const getDate = (date) => {
  const newDate = new Date(date);
  const year = newDate.getUTCFullYear();
  const month = (newDate.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = newDate.getUTCDate().toString().padStart(2, '0');
  const hour = newDate.getUTCHours().toString().padStart(2, '0');
  const minute = newDate.getUTCMinutes().toString().padStart(2, '0');
  const seconds = newDate.getUTCSeconds().toString().padStart(2, '0');

  return `${year}/${month}/${day} ${hour}:${minute}:${seconds}`;
};

export const GetDate = (props) => {
  const { date, ...rest } = props;
  return <div {...rest}>{getDate(date)}</div>;
};

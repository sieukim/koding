export const getDate = (date) => {
  const newDate = new Date(date);
  const year = newDate.getFullYear();
  const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
  const day = newDate.getDay().toString().padStart(2, '0');
  const hour = newDate.getHours().toString().padStart(2, '0');
  const minute = newDate.getMinutes().toString().padStart(2, '0');
  const seconds = newDate.getSeconds().toString().padStart(2, '0');

  return `${year}/${month}/${day} ${hour}:${minute}:${seconds}`;
};

export const getCurrentTime = () => {
  const date = new Date();
  date.setHours(date.getHours() + 9);
  return date;
};

export const getCurrentDate = () => {
  const date = getCurrentTime();
  date.setHours(0, 0, 0, 0);
  return date;
};

export const isSameDate = (d1: Date, d2: Date) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

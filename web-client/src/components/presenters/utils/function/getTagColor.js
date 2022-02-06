export const getTagColor = (tag) => {
  const tagColor = [
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
  ];

  const colorIndex = tag.length % 10;
  return tagColor[colorIndex];
};

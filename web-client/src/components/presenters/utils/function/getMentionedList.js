export const getMentionedList = (comment) => {
  // 멘션 리스트
  const mentionedNicknames = [];
  // @ 위치 찾기
  const mentionedIndex = [];
  for (let i = 0; i < comment.length; i++) {
    if (comment[i] === '@') mentionedIndex.push(i);
  }
  // @를 시작으로 다음 공백이 나올 때까지 파싱하기
  for (let i = 0; i < mentionedIndex.length; i++) {
    const index = mentionedIndex[i];
    // @ 직전에 다른 글자가 없는 경우만 멘션으로 취급
    if (
      comment[index - 1] === ' ' ||
      comment[index - 1] === undefined ||
      comment[index - 1] === null
    ) {
      let mentionedNickname = '';
      for (let j = index + 1; j < comment.length; j++) {
        if (comment[j] === ' ') {
          break;
        } else if (comment[j] === '@') {
          mentionedNickname = '';
          break;
        } else {
          mentionedNickname += comment[j];
        }
      }
      mentionedNicknames.push(mentionedNickname);
    }
  }
  return mentionedNicknames;
};

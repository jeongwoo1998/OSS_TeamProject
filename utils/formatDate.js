export const formatDate = (date) => {
  if (!date || !(date instanceof Date)) {
    return '날짜가 유효하지 않습니다'; // 예외 처리
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

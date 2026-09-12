/**
 * 피셔-예이츠 알고리즘으로 배열을 랜덤 셔플
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * 고정된 자리를 제외하고 나머지 학생만 랜덤 셔플
 * @param {Array} seats - 현재 자리 배열 [{id, student, fixed}, ...]
 * @returns {Array} 셔플된 새 자리 배열
 */
export function shuffleSeats(seats) {
  // 고정되지 않은 자리의 인덱스 수집
  const freeIndices = seats
    .map((seat, idx) => (!seat.fixed ? idx : null))
    .filter((idx) => idx !== null);

  // 고정되지 않은 자리의 학생 목록 수집 (null 포함)
  const freeStudents = freeIndices.map((idx) => seats[idx].student);

  // 학생만 셔플
  const shuffledStudents = shuffleArray(freeStudents);

  // 새 자리 배열 복사 후 적용
  const newSeats = seats.map((seat) => ({ ...seat }));
  freeIndices.forEach((idx, i) => {
    newSeats[idx] = { ...newSeats[idx], student: shuffledStudents[i] };
  });

  return newSeats;
}

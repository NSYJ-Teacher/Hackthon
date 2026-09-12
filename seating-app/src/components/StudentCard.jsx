import { useRef, useCallback } from 'react';

/**
 * 학생 카드 컴포넌트
 * - 더블클릭으로 고정 ON/OFF
 * - 성별에 따라 색상 다름
 * - 고정 시 자물쇠 아이콘 표시
 */
export default function StudentCard({ seat, onToggleFixed, seatNumber }) {
  const { student, fixed } = seat;
  const lastClick = useRef(0);

  const handleClick = useCallback(() => {
    const now = Date.now();
    if (now - lastClick.current < 300) {
      onToggleFixed(seat.id);
    }
    lastClick.current = now;
  }, [seat.id, onToggleFixed]);

  if (!student) {
    return (
      <div className="student-card empty-card">
        <span className="seat-number">{seatNumber}</span>
        <span className="empty-label">빈 자리</span>
      </div>
    );
  }

  const genderClass =
    student.gender === 'M' ? 'male' : student.gender === 'F' ? 'female' : 'neutral';

  return (
    <div
      className={`student-card ${genderClass} ${fixed ? 'fixed' : ''}`}
      onClick={handleClick}
      title="더블클릭으로 자리 고정/해제"
    >
      {fixed && <span className="lock-icon">🔒</span>}
      <span className="seat-number">{seatNumber}</span>
      <div className="card-emoji">{student.emoji}</div>
      <div className="card-name">{student.name}</div>
      {student.gender && (
        <div className={`gender-badge ${genderClass}`}>
          {student.gender === 'M' ? '남' : '여'}
        </div>
      )}
    </div>
  );
}

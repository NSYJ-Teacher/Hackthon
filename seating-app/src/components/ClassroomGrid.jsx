import StudentCard from './StudentCard';

/**
 * 교실 격자 컴포넌트
 * - rows x cols 격자로 자리 표시
 * - 상단에 칠판 표시
 * - 좌→우, 위→아래 순으로 번호 부여
 */
export default function ClassroomGrid({ seats, rows, cols, onToggleFixed, isShuffling }) {
  return (
    <div className="classroom-wrapper">
      {/* 칠판 */}
      <div className="blackboard">
        <span className="blackboard-text">📋 칠판</span>
      </div>

      {/* 선생님 책상 */}
      <div className="teacher-desk">
        <span>🧑‍🏫 선생님</span>
      </div>

      {/* 자리 격자 */}
      <div
        className={`classroom-grid ${isShuffling ? 'shuffling' : ''}`}
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {seats.map((seat, idx) => (
          <div
            key={seat.id}
            className={`seat-wrapper ${isShuffling ? 'seat-animate' : ''}`}
            style={{ animationDelay: `${(idx % cols) * 30 + Math.floor(idx / cols) * 50}ms` }}
          >
            <StudentCard
              seat={seat}
              seatNumber={idx + 1}
              onToggleFixed={onToggleFixed}
            />
          </div>
        ))}
      </div>

      {/* 출입구 */}
      <div className="classroom-footer">
        <div className="door">🚪 출입구</div>
      </div>
    </div>
  );
}

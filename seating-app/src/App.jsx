import { useState, useEffect, useCallback } from 'react';
import ClassroomGrid from './components/ClassroomGrid';
import ControlPanel from './components/ControlPanel';
import SettingsModal from './components/SettingsModal';
import { shuffleSeats } from './utils/shuffle';
import { parseExcelFile, getRandomEmoji } from './utils/excelParser';
import { saveState, loadState } from './utils/storage';
import './App.css';

const DEFAULT_ROWS = 4;
const DEFAULT_COLS = 6;

/** 기본 학생 목록 생성 (번호만) */
function createDefaultStudents(count) {
  const genders = ['M', 'F'];
  return Array.from({ length: count }, (_, i) => ({
    id: `default-${i}`,
    name: `${i + 1}번`,
    gender: null,
    emoji: getRandomEmoji(null),
  }));
}

/** 자리 배열 생성 */
function createSeats(rows, cols, students) {
  const total = rows * cols;
  return Array.from({ length: total }, (_, i) => ({
    id: `seat-${i}`,
    student: students[i] || null,
    fixed: false,
  }));
}

export default function App() {
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [seats, setSeats] = useState([]);
  const [students, setStudents] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  // 초기 로드: LocalStorage 또는 기본값
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setRows(saved.rows || DEFAULT_ROWS);
      setCols(saved.cols || DEFAULT_COLS);
      setStudents(saved.students || []);
      setSeats(saved.seats || createSeats(saved.rows, saved.cols, saved.students || []));
    } else {
      const defaultStudents = createDefaultStudents(DEFAULT_ROWS * DEFAULT_COLS);
      setStudents(defaultStudents);
      setSeats(createSeats(DEFAULT_ROWS, DEFAULT_COLS, defaultStudents));
    }
  }, []);

  // 상태 변경 시 자동 저장
  useEffect(() => {
    if (seats.length > 0) {
      saveState({ rows, cols, students, seats });
    }
  }, [rows, cols, students, seats]);

  /** 토스트 메시지 표시 */
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  /** 자리 섞기 */
  const handleShuffle = useCallback(() => {
    setIsShuffling(true);
    setTimeout(() => {
      setSeats((prev) => shuffleSeats(prev));
      setIsShuffling(false);
      showToast('자리를 섞었어요! 🎲', 'success');
    }, 500);
  }, [showToast]);

  /** 고정 토글 */
  const handleToggleFixed = useCallback((seatId) => {
    setSeats((prev) =>
      prev.map((s) => {
        if (s.id !== seatId) return s;
        const next = !s.fixed;
        return { ...s, fixed: next };
      })
    );
  }, []);

  /** 엑셀 업로드 */
  const handleUpload = useCallback(
    async (file) => {
      setUploadError(null);
      try {
        const parsed = await parseExcelFile(file);
        setStudents(parsed);
        const total = rows * cols;
        const padded = [...parsed];
        while (padded.length < total) padded.push(null);
        const newSeats = createSeats(rows, cols, padded);
        setSeats(newSeats);
        showToast(`${parsed.length}명 학생을 불러왔어요! 📋`, 'success');
      } catch (err) {
        setUploadError(err.message);
        showToast('엑셀 파일을 읽을 수 없어요 😅', 'error');
      }
    },
    [rows, cols, showToast]
  );

  /** 설정 적용 */
  const handleApplySettings = useCallback(
    ({ rows: newRows, cols: newCols }) => {
      setRows(newRows);
      setCols(newCols);
      const total = newRows * newCols;
      const padded = [...students];
      while (padded.length < total) padded.push(null);
      setSeats(createSeats(newRows, newCols, padded));
      showToast(`교실 크기: ${newRows}행 ${newCols}열로 변경했어요!`, 'info');
    },
    [students, showToast]
  );

  const fixedCount = seats.filter((s) => s.fixed).length;
  const studentCount = students.filter(Boolean).length;

  return (
    <div className="app-container">
      <ControlPanel
        onShuffle={handleShuffle}
        onUpload={handleUpload}
        onOpenSettings={() => setShowSettings(true)}
        fixedCount={fixedCount}
        totalCount={studentCount}
        isShuffling={isShuffling}
      />

      {uploadError && (
        <div className="error-banner no-print">
          ⚠️ {uploadError}
        </div>
      )}

      <main className="main-content">
        <ClassroomGrid
          seats={seats}
          rows={rows}
          cols={cols}
          onToggleFixed={handleToggleFixed}
          isShuffling={isShuffling}
        />
      </main>

      {showSettings && (
        <SettingsModal
          rows={rows}
          cols={cols}
          onApply={handleApplySettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* 토스트 메시지 */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* 인쇄용 제목 */}
      <div className="print-title print-only">
        자리 배치표
      </div>
    </div>
  );
}

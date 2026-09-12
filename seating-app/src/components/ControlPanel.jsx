import { useRef } from 'react';

/**
 * 상단 컨트롤 패널
 * - 자리 섞기, 명렬표 업로드, 설정, 인쇄
 */
export default function ControlPanel({
  onShuffle,
  onUpload,
  onOpenSettings,
  fixedCount,
  totalCount,
  isShuffling,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      e.target.value = '';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="control-panel no-print">
      <div className="control-left">
        <div className="app-title">
          <span className="title-emoji">🏫</span>
          <span>자리 배치 도우미</span>
        </div>
        {totalCount > 0 && (
          <div className="stats">
            <span className="stat-item">
              👥 학생 <strong>{totalCount}</strong>명
            </span>
            {fixedCount > 0 && (
              <span className="stat-item fixed-stat">
                🔒 고정 <strong>{fixedCount}</strong>자리
              </span>
            )}
          </div>
        )}
      </div>

      <div className="control-right">
        {/* 명렬표 업로드 */}
        <input
          type="file"
          accept=".xlsx,.xls"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="excel-upload"
        />
        <button
          className="btn btn-secondary"
          onClick={() => fileInputRef.current?.click()}
          title="엑셀 명렬표 업로드"
        >
          📤 명렬표 업로드
        </button>

        {/* 설정 */}
        <button
          className="btn btn-secondary"
          onClick={onOpenSettings}
          title="행/열 수 설정"
        >
          ⚙️ 설정
        </button>

        {/* 자리 섞기 */}
        <button
          className={`btn btn-primary ${isShuffling ? 'spinning' : ''}`}
          onClick={onShuffle}
          disabled={isShuffling || totalCount === 0}
          title="자리 무작위 배치"
        >
          🔀 자리 섞기
        </button>

        {/* 인쇄 */}
        <button
          className="btn btn-print"
          onClick={handlePrint}
          title="자리 배치표 인쇄"
        >
          🖨️ 인쇄
        </button>
      </div>
    </div>
  );
}

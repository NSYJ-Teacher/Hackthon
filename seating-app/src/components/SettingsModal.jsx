/**
 * 설정 모달: 행/열 수 변경 + 학생 직접 입력
 */
export default function SettingsModal({ rows, cols, onApply, onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const newRows = Math.max(1, Math.min(10, Number(data.get('rows'))));
    const newCols = Math.max(1, Math.min(10, Number(data.get('cols'))));
    onApply({ rows: newRows, cols: newCols });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">⚙️ 교실 설정</h2>

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="setting-rows">행 수 (앞뒤)</label>
            <input
              id="setting-rows"
              type="number"
              name="rows"
              defaultValue={rows}
              min="1"
              max="10"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="setting-cols">열 수 (좌우)</label>
            <input
              id="setting-cols"
              type="number"
              name="cols"
              defaultValue={cols}
              min="1"
              max="10"
              required
            />
          </div>

          <div className="modal-hint">
            💡 설정 변경 시 현재 자리 배치가 초기화됩니다.
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              취소
            </button>
            <button type="submit" className="btn btn-primary">
              적용
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

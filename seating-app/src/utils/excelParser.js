import * as XLSX from 'xlsx';

/**
 * 엑셀 파일을 파싱하여 학생 목록을 반환
 * 셀 배경색으로 성별 판단: 파랑 계열 = 남, 분홍/빨강 계열 = 여, 없으면 null
 */
export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellStyles: true });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const students = [];
        const range = XLSX.utils.decode_range(sheet['!ref'] || 'A1');

        for (let row = range.s.r; row <= range.e.r; row++) {
          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddr = XLSX.utils.encode_cell({ r: row, c: col });
            const cell = sheet[cellAddr];
            if (!cell || !cell.v) continue;

            const value = String(cell.v).trim();
            // 이름으로 보이는 셀 (2글자 이상, 숫자 아님)
            if (value.length >= 2 && !/^\d+$/.test(value)) {
              const gender = detectGender(cell);
              students.push({
                id: `student-${row}-${col}`,
                name: value,
                gender, // 'M', 'F', null
                emoji: getRandomEmoji(gender),
              });
            }
          }
        }

        if (students.length === 0) {
          reject(new Error('학생 이름을 찾을 수 없습니다. 엑셀 파일 형식을 확인해주세요.'));
          return;
        }

        resolve(students);
      } catch (err) {
        reject(new Error('엑셀 파일 읽기 실패: ' + err.message));
      }
    };
    reader.onerror = () => reject(new Error('파일 읽기 오류'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * 셀의 배경색으로 성별 판단
 */
function detectGender(cell) {
  try {
    const bgColor =
      cell?.s?.fgColor?.rgb ||
      cell?.s?.bgColor?.rgb ||
      cell?.s?.fill?.fgColor?.rgb ||
      null;

    if (!bgColor || bgColor === 'FFFFFF' || bgColor === 'ffffff' || bgColor === '000000') {
      return null;
    }

    const r = parseInt(bgColor.substring(0, 2), 16);
    const g = parseInt(bgColor.substring(2, 4), 16);
    const b = parseInt(bgColor.substring(4, 6), 16);

    // 파랑 계열: 파랑이 가장 강하고 빨강이 적음
    if (b > r + 30 && b > g - 10) return 'M';
    // 분홍/빨강 계열: 빨강이 강하고 파랑이 적음
    if (r > b + 30) return 'F';
    return null;
  } catch {
    return null;
  }
}

/**
 * 성별에 따른 랜덤 이모지 반환
 */
const BOY_EMOJIS = ['😊', '😄', '🤗', '😎', '🙂', '😁', '🤩', '😃'];
const GIRL_EMOJIS = ['🥰', '😍', '🤗', '😊', '🌸', '💖', '✨', '🎀'];
const NEUTRAL_EMOJIS = ['😊', '😄', '🤗', '😎', '🙂', '😁', '🌟', '💫'];

export function getRandomEmoji(gender) {
  if (gender === 'M') return BOY_EMOJIS[Math.floor(Math.random() * BOY_EMOJIS.length)];
  if (gender === 'F') return GIRL_EMOJIS[Math.floor(Math.random() * GIRL_EMOJIS.length)];
  return NEUTRAL_EMOJIS[Math.floor(Math.random() * NEUTRAL_EMOJIS.length)];
}

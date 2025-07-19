import { SUB_RECORD_NUM } from '../constants.js';
import { updateSubTotal, updateSerialNum } from '../utils.js';

export function removeRow(row) {
  const table = row.closest('table');
  const subRecordNum = row.getAttribute(SUB_RECORD_NUM);

  if (row.classList.contains('subRecord')) {
    table.querySelectorAll(`tr[${SUB_RECORD_NUM}="${subRecordNum}"]`).forEach((el) => el.remove());
  } else {
    row.remove();
  }

  updateSubTotal(table);
  updateSerialNum(table);
}

// No global exposure needed 
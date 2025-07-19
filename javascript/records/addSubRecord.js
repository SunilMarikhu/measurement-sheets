import { SUB_RECORD_NUM, cellContents } from '../constants.js';
import { updateSubTotal, updateSerialNum, getNewRowIndex, updateTotal, generateUniqueId } from '../utils.js';
import { removeRow } from './removeRow.js';

export function addSubRecord(element, recordTable, isLessRecord = false, targetRowIndex = undefined) {
  let subRecordCount = recordTable.querySelectorAll('.serialNumber').length;
  let subRecordNum   = subRecordCount;
  const rowIndex     = targetRowIndex ?? recordTable.querySelector('.table-footer').rowIndex;

  if (isLessRecord) {
    subRecordNum = element.closest('tr').getAttribute(SUB_RECORD_NUM);
  }

  const subRecordRow = recordTable.insertRow(rowIndex);
  subRecordRow.setAttribute(SUB_RECORD_NUM, subRecordNum);
  subRecordRow.classList.add(isLessRecord ? 'innerRecord' : 'subRecord');

  // First cell (serial number or dash)
  const cell0 = subRecordRow.insertCell(0);

  // Dynamic cells
  for (let i = 0; i < cellContents.length; i++) {
    const cell = subRecordRow.insertCell(i + 1);
    cell.innerHTML = cellContents[i];
    if (i === cellContents.length - 1) {
      cell.classList.add('subRecordTotal');
      if (isLessRecord) cell.classList.add('negativeValue');
    }
  }

  // Assign unique IDs to input fields
  subRecordRow.querySelectorAll('input').forEach((inputEl) => {
    const prefix = inputEl.getAttribute('name') || 'input';
    inputEl.id = generateUniqueId(prefix);
  });

  // Actions cell
  const lastCell = subRecordRow.insertCell(cellContents.length + 1);
  if (!isLessRecord) {
    subRecordCount++;
    cell0.textContent = `${subRecordCount}.`;
    cell0.classList.add('serialNumber');
    lastCell.innerHTML = '<button class="addInnerRecordBtn"> + Less</button>';
  } else {
    cell0.textContent = '-';
  }
  lastCell.innerHTML += '<button class="deleteSubRecordBtn"><img src="icons/delete.png" class="icons delete-icon"></button>';
  lastCell.classList.add('lastCol');

  // Event handlers
  subRecordRow.querySelector('.addInnerRecordBtn')?.addEventListener('click', function () {
    addSubRecord(this, recordTable, true, getNewRowIndex(this.closest('tr')));
  });

  subRecordRow.querySelector('.deleteSubRecordBtn').addEventListener('click', function () {
    if (confirm('Are you sure to delete this record?')) {
      removeRow(this.closest('tr'));
    }
  });

  subRecordRow.querySelector('input[name="height"]').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addSubRecord(this, recordTable, isLessRecord, getNewRowIndex(this.closest('tr')));
    }
  });

  subRecordRow.querySelector('input[name="description"]').focus();
  if (targetRowIndex !== undefined && !isLessRecord) updateSerialNum(recordTable);

  // Attach keyup listeners to inputs for dynamic total updates
  ['number', 'length', 'width', 'height'].forEach((field) => {
    const inputEl = subRecordRow.querySelector(`input[name="${field}"]`);
    if (inputEl) {
      inputEl.addEventListener('keyup', () => updateTotal(inputEl));
    }
  });
}

// No global exposure needed 
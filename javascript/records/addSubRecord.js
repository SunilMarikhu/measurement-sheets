import { SUB_RECORD_NUM, cellContents } from '../utils/constants.js';
import { updateSerialNum, getNewRowIndex, updateTotal, generateUniqueId, getIconPath } from '../utils/utils.js';
import { removeRow } from './removeRow.js';

let subRecordGlobalId = 1;

export function addSubRecord(element, recordTable, isLessRecord = false, targetRowIndex = undefined, subRecordId = undefined) {
  let subRecordCount = recordTable.querySelectorAll('.serialNumber').length;
  let subRecordNum   = subRecordCount;
  const rowIndex     = targetRowIndex ?? recordTable.querySelector('.table-footer').rowIndex;

  if (isLessRecord) {
    subRecordNum = element.closest('tr').getAttribute(SUB_RECORD_NUM);
  }

  const subRecordRow = recordTable.insertRow(rowIndex);
  subRecordRow.setAttribute(SUB_RECORD_NUM, subRecordNum);
  subRecordRow.classList.add(isLessRecord ? 'innerRecord' : 'subRecord');
  // Assign a unique integer id to each sub-record, or use provided id
  subRecordRow.dataset.subrecordId = subRecordId !== undefined ? subRecordId : subRecordGlobalId++;

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
    cell0.textContent = `${subRecordCount}`;
    cell0.classList.add('serialNumber');
    lastCell.innerHTML = '<button class="btn btn-sm btn-outline-secondary w-auto text-nowrap addInnerRecordBtn"> + Less</button>';
  } else {
    cell0.textContent = '-';
  }
  lastCell.innerHTML += `<button class="btn btn-sm btn-danger ms-1 deleteSubRecordBtn"><img src="${getIconPath('delete.png')}" class="icons delete-icon"></button>`;
  lastCell.classList.add('lastCol');

  // Event handlers
  const addInnerBtn = subRecordRow.querySelector('.addInnerRecordBtn');
  if (addInnerBtn) {
    addInnerBtn.addEventListener('click', function () {
      addSubRecord(this, recordTable, true, getNewRowIndex(this.closest('tr')));
    });
  }

  const deleteBtn = subRecordRow.querySelector('.deleteSubRecordBtn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function () {
      if (confirm('Are you sure to delete this record?')) {
        removeRow(this.closest('tr'));
      }
    });
  }

  const heightInput = subRecordRow.querySelector('input[name="height"]');
  if (heightInput) {
    heightInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        addSubRecord(this, recordTable, isLessRecord, getNewRowIndex(this.closest('tr')));
      }
    });
  }

  const descInput = subRecordRow.querySelector('input[name="description"]');
  if (descInput) descInput.focus();

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
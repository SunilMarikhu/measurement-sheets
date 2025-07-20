import { cellLabels, dimensionCellLabels, unitOptions } from '../utils/constants.js';
import { addSubRecord } from './addSubRecord.js';
import { generateUniqueId, getIconPath } from '../utils/utils.js';

let recordsCount = 0;

function createRecordTable({ title = '', unit = '', onDelete, onAddMeasurement }) {
  // Create table
  const table = document.createElement('table');
  table.className = 'table table-bordered table-hover align-middle my-1 table-compact';

  // Header row
  const headerRow = table.insertRow(0);
  headerRow.classList.add('table-header');
  const titleCell = headerRow.insertCell(0);
  const unitCell = headerRow.insertCell(1);
  const actionsCell = headerRow.insertCell(2);

  titleCell.colSpan = cellLabels.length;
  titleCell.style.textAlign = 'left';

  // Title input
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.className = 'recordTitleInput form-control form-control-sm';
  titleInput.placeholder = title || `Record-${recordsCount}`;
  titleInput.id = generateUniqueId('recordTitle');
  titleInput.style.width = '100%';
  titleInput.style.maxWidth = '99%';
  titleInput.style.marginRight = '10px';
  titleInput.value = title;

  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'recordTitleWrapper';
  titleWrapper.appendChild(titleInput);
  titleCell.appendChild(titleWrapper);

  // Unit select
  const unitSelect = document.createElement('select');
  unitSelect.className = 'recordUnitSelect form-select form-select-sm';
  unitSelect.style.minWidth = '90px';
  unitOptions.forEach(opt => {
    const optionEl = document.createElement('option');
    optionEl.value = opt.value;
    optionEl.textContent = opt.label;
    unitSelect.appendChild(optionEl);
  });
  if (unit) unitSelect.value = unit;
  unitCell.style.textAlign = 'center';
  unitCell.style.verticalAlign = 'middle';
  unitCell.style.width = '1%';
  unitCell.style.whiteSpace = 'nowrap';
  unitCell.appendChild(unitSelect);

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = `<img src="${getIconPath('delete.png')}" class="icons delete-icon">`;
  deleteBtn.className = 'deleteRecordBtn';
  actionsCell.style.textAlign = 'right';
  actionsCell.style.verticalAlign = 'middle';
  actionsCell.style.width = '1%';
  actionsCell.appendChild(deleteBtn);
  if (onDelete) deleteBtn.addEventListener('click', onDelete);

  // Column headers row
  const headerRow2 = table.insertRow(1);
  for (let i = 0; i < cellLabels.length; i++) {
    if (cellLabels[i] === 'Unit') continue;
    const cell = headerRow2.insertCell(-1);
    cell.textContent = cellLabels[i];
    if (cellLabels[i] === 'Dimensions') {
      cell.colSpan = 3;
    } else {
      cell.rowSpan = 2;
    }
    if (cellLabels[i] === 'Actions') cell.classList.add('lastColHeader');
  }

  // Dimension labels row
  const dimensionRow = table.insertRow(2);
  for (let i = 0; i < dimensionCellLabels.length; i++) {
    const cell = dimensionRow.insertCell(i);
    cell.textContent = dimensionCellLabels[i];
  }

  // Footer row
  const footerRow = table.insertRow(3);
  footerRow.classList.add('table-footer');
  // Add Measurement button
  const addMeasurementBtn = document.createElement('button');
  addMeasurementBtn.textContent = 'Add Measurement';
  addMeasurementBtn.className = 'btn btn-outline-success';
  if (onAddMeasurement) addMeasurementBtn.addEventListener('click', onAddMeasurement);
  const addBtnCell = footerRow.insertCell(0);
  addBtnCell.appendChild(addMeasurementBtn);
  addBtnCell.colSpan = 3;
  addBtnCell.classList.add('text-start');
  // Sub-Total label
  const subTotalLabelCell = footerRow.insertCell(1);
  subTotalLabelCell.textContent = 'Sub-Total';
  subTotalLabelCell.colSpan = 3;
  // Sub-Total value
  const subTotalValueCell = footerRow.insertCell(2);
  subTotalValueCell.className = 'recordTotal';
  subTotalValueCell.textContent = '0';
  // Footer unit
  const footerUnitCell = footerRow.insertCell(3);
  footerUnitCell.className = 'footerUnit';

  // Update footer unit text
  const updateFooterUnit = () => {
    const selectedOption = unitSelect.options[unitSelect.selectedIndex];
    footerUnitCell.textContent = selectedOption.label;
  };
  updateFooterUnit();
  unitSelect.addEventListener('change', updateFooterUnit);

  return {
    table,
    addMeasurementBtn,
    deleteBtn,
    titleInput,
    unitSelect,
    footerUnitCell,
  };
}

function populateSubRecords(table, subRecords) {
  if (!Array.isArray(subRecords)) return;
  subRecords.forEach(subRecord => {
    // Insert before the footer
    const footerRow = table.querySelector('.table-footer');
    const rowIndex = footerRow ? footerRow.rowIndex : table.rows.length;
    const isLessRecord = !!subRecord.isLessRecord;
    addSubRecord({ closest: () => table }, table, isLessRecord, rowIndex);
    const newRow = table.rows[rowIndex];
    if (!newRow) return;
    // Fill in the data
    const cells = newRow.children;
    // cells[0] is serial number or dash
    cells[1].querySelector('input').className = 'form-control form-control-sm px-2 py-1';
    cells[2].querySelector('input').className = 'form-control form-control-sm px-2 py-1';
    cells[3].querySelector('input').className = 'form-control form-control-sm px-2 py-1';
    cells[4].querySelector('input').className = 'form-control form-control-sm px-2 py-1';
    cells[5].querySelector('input').className = 'form-control form-control-sm px-2 py-1';
    // cells[6] is quantity (auto-calculated)
  });
}

export function addRecord() {
  recordsCount++;
  const recordContainer = document.createElement('div');
  recordContainer.id = `project-${recordsCount}`;
  const onDelete = () => {
    if (confirm('Are you sure you want to delete this measurement block?')) {
      recordContainer.remove();
    }
  };
  const { table, addMeasurementBtn } = createRecordTable({
    title: '',
    unit: '',
    onDelete,
    onAddMeasurement: function () {
      addSubRecord(this, table, false);
    },
  });
  const container = document.getElementById('recordTablesContainer');
  container.prepend(recordContainer);
  recordContainer.appendChild(table);
}

export function addRecordFromData(recordData) {
  recordsCount++;
  const recordContainer = document.createElement('div');
  recordContainer.id = `project-${recordsCount}`;
  const onDelete = () => {
    if (confirm('Are you sure you want to delete this measurement block?')) {
      recordContainer.remove();
    }
  };
  const { table, addMeasurementBtn, unitSelect, titleInput } = createRecordTable({
    title: recordData.title || '',
    unit: recordData.unit || '',
    onDelete,
    onAddMeasurement: function () {
      addSubRecord(this, table, false);
    },
  });
  const container = document.getElementById('recordTablesContainer');
  container.prepend(recordContainer);
  recordContainer.appendChild(table);
  // Set initial values if provided
  if (recordData.title) titleInput.value = recordData.title;
  if (recordData.unit) unitSelect.value = recordData.unit;
  // Add sub-records from data
  if (recordData.subRecords && Array.isArray(recordData.subRecords)) {
    populateSubRecords(table, recordData.subRecords);
  }
} 
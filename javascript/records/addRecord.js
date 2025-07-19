import { cellLabels, dimensionCellLabels, unitOptions } from '../constants.js';
import { addSubRecord } from './addSubRecord.js';
import { generateUniqueId } from '../utils.js';

let recordsCount = 0;

export function addRecord() {
  recordsCount++;

  const newDiv = document.createElement('div');
  newDiv.id = `project-${recordsCount}`;
  const addSubBtn = document.createElement('button');
  addSubBtn.textContent = 'Add Measurement';
  addSubBtn.classList.add('addSubRecordBtn');

  const deleteRecordBtn = document.createElement('button');
  deleteRecordBtn.innerHTML = '<img src="icons/delete.png" class="icons delete-icon">';
  deleteRecordBtn.classList.add('deleteRecordBtn');

  const recordTable = document.createElement('table');

  // Header
  const headerRow = recordTable.insertRow(0);
  headerRow.classList.add('table-header');
  const headerCell1 = headerRow.insertCell(0);
  const unitCell = headerRow.insertCell(1);
  const headerCell2 = headerRow.insertCell(2);

  headerCell1.colSpan = cellLabels.length; // exclude Unit column
  headerCell1.style.textAlign = 'left';

  // Create title input
  const recordNameInput = document.createElement('input');
  recordNameInput.type = 'text';
  recordNameInput.classList.add('recordTitleInput');
  recordNameInput.placeholder = `Record-${recordsCount}`;
  recordNameInput.id = generateUniqueId('recordTitle');
  recordNameInput.style.width = '100%';
  recordNameInput.style.maxWidth = '99%';
  recordNameInput.style.marginRight = '10px';

  const titleWrapper = document.createElement('div');
  titleWrapper.classList.add('recordTitleWrapper');
  titleWrapper.appendChild(recordNameInput);
  headerCell1.appendChild(titleWrapper);

  // Create unit select
  const unitSelect = document.createElement('select');
  unitSelect.classList.add('recordUnitSelect');

  unitOptions.forEach(opt => {
    const optionEl = document.createElement('option');
    optionEl.value = opt.value;
    optionEl.textContent = opt.label;
    unitSelect.appendChild(optionEl);
  });

  // unitCell styling
  unitCell.style.textAlign = 'center';
  unitCell.style.verticalAlign = 'middle';
  unitCell.style.width = '1%';
  unitCell.style.whiteSpace = 'nowrap';
  unitCell.appendChild(unitSelect);

  headerCell2.style.textAlign = 'right';
  headerCell2.style.verticalAlign = 'middle';
  headerCell2.style.width = '1%';
  headerCell2.appendChild(deleteRecordBtn);

  // Place in DOM
  const container = document.getElementById('recordTablesContainer');
  container.prepend(newDiv);
  newDiv.appendChild(recordTable);
  newDiv.appendChild(addSubBtn);

  // Delete record
  deleteRecordBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this measurement block?')) {
      newDiv.remove();
    }
  });

  // Column headers
  const headerRow2 = recordTable.insertRow(1);
  for (let i = 0; i < cellLabels.length; i++) {
    if (cellLabels[i] === 'Unit') continue; // skip Unit label in row2
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
  const dimensionRow = recordTable.insertRow(2);
  for (let i = 0; i < dimensionCellLabels.length; i++) {
    const cell = dimensionRow.insertCell(i);
    cell.textContent = dimensionCellLabels[i];
  }

  // Footer (sub-total)
  const footerRow = recordTable.insertRow(3);
  footerRow.classList.add('table-footer');
  const footerCell1 = footerRow.insertCell(0);
  const footerCell2 = footerRow.insertCell(1);
  const footerUnitCell = footerRow.insertCell(2);
  footerCell1.textContent = 'Sub-Total';
  footerCell2.textContent = '0';
  footerCell1.colSpan = 6;
  footerCell2.classList.add('recordTotal');
  footerUnitCell.classList.add('footerUnit');

  // Function to update footer unit text
  const updateFooterUnit = () => {
    const selectedOption = unitSelect.options[unitSelect.selectedIndex];
    footerUnitCell.textContent = selectedOption.label;
  };

  // Set initial unit text and add change listener
  updateFooterUnit();
  unitSelect.addEventListener('change', updateFooterUnit);

  // Add first sub-record button
  addSubBtn.addEventListener('click', function () {
    addSubRecord(this, recordTable, false);
  });
}

// No global exposure needed 
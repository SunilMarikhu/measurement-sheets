import { SUB_RECORD_NUM } from './constants.js';


export function calculateVolume(length, width, height) {
  return length * width * height;
}

export function updateSubTotal(table) {
  const subRecordTotals = table.querySelectorAll('.subRecordTotal');
  let sum = 0;
  subRecordTotals.forEach((element) => {
    const multiplier = element.classList.contains('negativeValue') ? -1 : 1;
    sum += parseFloat(element.textContent) * multiplier;
  });
  const recordTotal = table.querySelector('.recordTotal');
  recordTotal.textContent = sum;
}

export function updateSerialNum(table) {
  const serialNumCells = table.querySelectorAll('.serialNumber');
  serialNumCells.forEach((cell, i) => {
    cell.textContent = `${i + 1}.`;
  });
}

export function getNewRowIndex(row) {
  const table = row.closest('table');
  const relatedRows = table.querySelectorAll(`tr[${SUB_RECORD_NUM}="${row.getAttribute(SUB_RECORD_NUM)}"]`);
  return relatedRows[relatedRows.length - 1].rowIndex + 1;
}

export function updateTotal(input) {
  const row = input.parentElement.parentElement;
  let number = parseFloat(row.querySelector('input[name="number"]').value);
  let length = parseFloat(row.querySelector('input[name="length"]').value);
  let width  = parseFloat(row.querySelector('input[name="width"]').value);
  let height = parseFloat(row.querySelector('input[name="height"]').value);

  const allEmptyOrZero = (isNaN(length) || length === 0) && (isNaN(width) || width === 0) && (isNaN(height) || height === 0);
  if (allEmptyOrZero) {
    row.querySelector('.subRecordTotal').textContent = 0;
    updateSubTotal(row.closest('table'));
    return;
  }

  if (isNaN(length) || length === 0) length = 1;
  if (isNaN(width)  || width  === 0) width  = 1;
  if (isNaN(height) || height === 0) height = 1;

  const volume = calculateVolume(length, width, height);
  const total  = volume * number;

  if (!isNaN(total)) {
    row.querySelector('.subRecordTotal').textContent = total;
    updateSubTotal(row.closest('table'));
  }
}

// Generate a unique id using prefix, current timestamp and a small random segment
export function generateUniqueId(prefix) {
  const ts = Date.now();
  const rand = Math.floor(Math.random() * 100000); // five digits
  return `${prefix}-${ts}-${rand}`;
}

// No global exposure necessary now that inline handlers are gone. 

// Function to get the correct icon path using absolute path
export function getIconPath(iconName) {
  return `${window.location.origin}/images/icons/${iconName}`;
} 
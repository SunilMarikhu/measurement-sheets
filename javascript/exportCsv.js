import { headers } from './constants.js';

export function exportCsv() {
  let mergedRow = '';
  const tables = document.querySelectorAll('table');

  const projectName = document.querySelector('input[name="projectName"]').value.trim() || 'New_Project';
  mergedRow += ['', projectName, '\n'].join(',');
  mergedRow += ['', document.querySelector('textArea[name="projectDetails"]').value, '\n\n'].join(',');

  tables.forEach((table) => {
    const recordTitle = table.querySelector('.recordTitleInput')?.value.trim() || 'Untitled';
    mergedRow += ['', recordTitle, '\n'].join(',');
    mergedRow += headers.join(',') + '\n';

    const recordUnit = table.querySelector('.recordUnitSelect')?.value || '';
    const subRecords = table.querySelectorAll('tr.subRecord, tr.innerRecord');
    subRecords.forEach((subRecord) => {
      const cells = subRecord.children;
      const sn         = cells[0].textContent;
      const description = cells[1].firstChild.value;
      const nos        = cells[2].firstChild.value;
      const length     = cells[3].firstChild.value;
      const width      = cells[4].firstChild.value;
      const height     = cells[5].firstChild.value;
      const quantity   = (subRecord.classList.contains('innerRecord') ? '-' : '') + cells[6].textContent;

      mergedRow += [sn, description, nos, recordUnit, length, width, height, quantity, '\n'].join(',');
    });

    const subTotal = table.querySelector('td.recordTotal').textContent;
    mergedRow += [...Array(4), 'Sub-Total', subTotal, recordUnit, '\n\n'].join(',');
  });

  const blob = new Blob([mergedRow], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${projectName}_Measurement_Sheet.csv`;
  document.body.appendChild(link);
  link.click();
}

// No global exposure needed 
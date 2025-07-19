import { headers } from './constants.js';

// Helper function to properly escape CSV fields
function escapeCsvField(field) {
  if (field === null || field === undefined) {
    return '""';
  }
  
  const stringField = String(field);
  
  // Always escape quotes by doubling them and wrap in quotes
  const escapedField = stringField.replace(/"/g, '""');
  return `"${escapedField}"`;
}

export function exportCsv() {
  let mergedRow = '';
  const tables = document.querySelectorAll('table');
  let recordCounter = 1;

  const projectName = document.querySelector('input[name="projectName"]').value.trim() || 'New_Project';
  mergedRow += [escapeCsvField(''), escapeCsvField(projectName), '\n'].join(',');
  mergedRow += [escapeCsvField(''), escapeCsvField(document.querySelector('textArea[name="projectDetails"]').value), '\n\n'].join(',');

  tables.forEach((table) => {
    const recordTitle = table.querySelector('.recordTitleInput')?.value.trim() || `Record-${recordCounter}`;
    mergedRow += [escapeCsvField(''), escapeCsvField(recordTitle), '\n'].join(',');
    recordCounter++;
    mergedRow += headers.map(header => escapeCsvField(header)).join(',') + '\n';

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
      let quantity = cells[6].textContent;
      if (subRecord.classList.contains('innerRecord')) {
        quantity = '-' + quantity;
      }

      mergedRow += [
        escapeCsvField(sn),
        escapeCsvField(description),
        escapeCsvField(nos),
        escapeCsvField(recordUnit),
        escapeCsvField(length),
        escapeCsvField(width),
        escapeCsvField(height),
        escapeCsvField(quantity),
        '\n'
      ].join(',');
    });

    const subTotal = table.querySelector('td.recordTotal').textContent;
    mergedRow += [
      ...Array(6).map(() => escapeCsvField(' ')),
      escapeCsvField('Sub-Total'),
      escapeCsvField(subTotal),
      '\n'
    ].join(',');
  });

  const blob = new Blob([mergedRow], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${projectName}_Measurement_Sheet.csv`;
  document.body.appendChild(link);
  link.click();
}

// No global exposure needed 
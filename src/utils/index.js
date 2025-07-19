export function calculateVolume(length, width, height) {
  return length * width * height;
}

// The following functions are for reference and will be adapted for React state management:
// updateSubTotal, updateSerialNum, getNewRowIndex, updateTotal
// In React, these will be handled via state and props, not direct DOM manipulation.

export function generateUniqueId(prefix) {
  const ts = Date.now();
  const rand = Math.floor(Math.random() * 100000); // five digits
  return `${prefix}-${ts}-${rand}`;
}

export function exportCsv(records, projectName = 'New_Project', projectDetails = '') {
  let mergedRow = '';
  mergedRow += ['', projectName, '\n'].join(',');
  mergedRow += ['', projectDetails, '\n\n'].join(',');

  records.forEach((record) => {
    const recordTitle = record.title?.trim() || 'Untitled';
    mergedRow += ['', recordTitle, '\n'].join(',');
    mergedRow += ['SN','Description','No.s','Unit','Length','Width','Height','Quantity','\n'].join(',');
    const recordUnit = record.unit || '';
    record.subRecords.forEach((sub, idx) => {
      const sn = idx + 1;
      const description = sub.description || '';
      const nos = sub.number || '';
      const length = sub.length || '';
      const width = sub.width || '';
      const height = sub.height || '';
      const quantity = (sub.negative ? '-' : '') + (sub.total || '');
      mergedRow += [sn, description, nos, recordUnit, length, width, height, quantity, '\n'].join(',');
    });
    const subTotal = record.subRecords.reduce((sum, sub) => sum + (sub.negative ? -1 : 1) * (parseFloat(sub.total) || 0), 0);
    mergedRow += [',,,Sub-Total', subTotal, recordUnit, '\n\n'].join(',');
  });

  const blob = new Blob([mergedRow], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${projectName}_Measurement_Sheet.csv`;
  document.body.appendChild(link);
  link.click();
} 
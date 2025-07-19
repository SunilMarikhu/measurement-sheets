import { addRecord } from './records/addRecord.js';
import { exportCsv } from './exportCsv.js';

// Main button bindings

document.getElementById('addRecordBtn').addEventListener('click', addRecord);
document.getElementById('exportCsvBtn').addEventListener('click', exportCsv); 
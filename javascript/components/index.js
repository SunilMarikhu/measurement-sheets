import { addRecord } from '../records/addRecord.js';
import { exportCsv } from '../utils/exportCsv.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Disable save button initially
    const saveBtn = document.getElementById('saveProjectBtn');
    if (saveBtn) {
        saveBtn.disabled = true;
    }
});

// Main button bindings
document.getElementById('addRecordBtn').addEventListener('click', addRecord);
document.getElementById('exportCsvBtn').addEventListener('click', exportCsv); 
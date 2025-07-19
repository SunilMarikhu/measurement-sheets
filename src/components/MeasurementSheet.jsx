import React, { useState } from 'react';
import Record from './Record';
import { generateUniqueId, exportCsv } from '../utils';

const MeasurementSheet = () => {
  const [records, setRecords] = useState([]);

  const handleAddRecord = () => {
    setRecords(prev => [
      ...prev,
      { id: generateUniqueId('record'), title: '', unit: '', subRecords: [] }
    ]);
  };

  const handleUpdateRecord = (updatedRecord) => {
    setRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
  };

  const handleRemoveRecord = (id) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const handleExport = () => {
    exportCsv(records);
  };

  return (
    <div>
      <h1>Measurement Sheet</h1>
      <button onClick={handleAddRecord}>Add Record</button>
      <button onClick={handleExport} style={{ marginLeft: 8 }}>Export CSV</button>
      <div>
        {records.map(record => (
          <Record
            key={record.id}
            record={record}
            onUpdate={handleUpdateRecord}
            onRemove={handleRemoveRecord}
          />
        ))}
      </div>
    </div>
  );
};

export default MeasurementSheet; 
import React, { useState } from 'react';
import { unitOptions } from '../constants';
import SubRecord from './SubRecord';
import { generateUniqueId } from '../utils';

const Record = ({ record, onUpdate, onRemove }) => {
  const [title, setTitle] = useState(record.title || '');
  const [unit, setUnit] = useState(record.unit || unitOptions[0].value);
  const [subRecords, setSubRecords] = useState(record.subRecords || []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    onUpdate({ ...record, title: e.target.value, unit, subRecords });
  };

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
    onUpdate({ ...record, title, unit: e.target.value, subRecords });
  };

  const handleAddSubRecord = () => {
    const newSub = {
      id: generateUniqueId('sub'),
      description: '',
      number: 0,
      length: 0,
      width: 0,
      height: 0,
      total: 0,
      negative: false,
    };
    const updated = [...subRecords, newSub];
    setSubRecords(updated);
    onUpdate({ ...record, title, unit, subRecords: updated });
  };

  const handleUpdateSubRecord = (updatedSub) => {
    const updated = subRecords.map((sub) =>
      sub.id === updatedSub.id ? updatedSub : sub
    );
    setSubRecords(updated);
    onUpdate({ ...record, title, unit, subRecords: updated });
  };

  const handleRemoveSubRecord = (id) => {
    const updated = subRecords.filter((sub) => sub.id !== id);
    setSubRecords(updated);
    onUpdate({ ...record, title, unit, subRecords: updated });
  };

  const subTotal = subRecords.reduce(
    (sum, sub) => sum + (sub.negative ? -1 : 1) * (parseFloat(sub.total) || 0),
    0
  );

  return (
    <div className="record-block" style={{ border: '1px solid #ccc', margin: '1rem 0', padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Record Title"
          style={{ flex: 1, fontSize: '1.2rem', fontWeight: 'bold' }}
        />
        <select value={unit} onChange={handleUnitChange}>
          {unitOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button onClick={() => onRemove(record.id)} title="Delete Record">
          <img src={require('../assets/delete.png')} alt="Delete" style={{ width: 20, height: 20 }} />
        </button>
      </div>
      <div style={{ marginTop: '1rem' }}>
        {subRecords.map((sub, idx) => (
          <SubRecord
            key={sub.id}
            subRecord={sub}
            index={idx}
            onUpdate={handleUpdateSubRecord}
            onRemove={handleRemoveSubRecord}
          />
        ))}
        <button onClick={handleAddSubRecord} style={{ marginTop: '0.5rem' }}>Add Measurement</button>
      </div>
      <div style={{ marginTop: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
        Sub-Total: {subTotal} {unitOptions.find(u => u.value === unit)?.label}
      </div>
    </div>
  );
};

export default Record; 